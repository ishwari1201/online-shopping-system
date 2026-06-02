const Product = require('../models/productModel');
const User = require('../models/userModel');
const Offer = require('../models/offerModel');
const OfferProduct = require('../models/offerProductModel');
const { canUploadProduct, syncProductsUploaded } = require('../utils/sellerSubscriptionUtils');
const {
  getOutfitCategories,
  getOutfitSlots,
  buildSubcategoryFilter,
  rankSimilarProducts,
  fetchOutfitBySlots,
} = require('../utils/recommendationUtils');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = 100; // Increased from 12 to 100 to allow frontend local filtering
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const filter = { ...keyword, status: 'Approved' };
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product && product.status === 'Approved') {
      const productObj = product.toObject();
      
      // Fetch active approved offers associated with this product
      const now = new Date();
      const mappings = await OfferProduct.find({ productId: product._id });
      if (mappings.length > 0) {
        const offerIds = mappings.map(m => m.offerId);
        const activeOffer = await Offer.findOne({
          _id: { $in: offerIds },
          status: 'Approved',
          startDate: { $lte: now },
          endDate: { $gte: now }
        }).populate('sellerId', 'name sellerProfile');
        
        if (activeOffer) {
          productObj.activeOffer = activeOffer;
        }
      }

      res.json(productObj);
    } else {
      res.status(404);
      throw new Error('Product not found or not approved');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Seller
const createProduct = async (req, res, next) => {
  try {
    if (req.user.role === 'seller') {
      const seller = await User.findById(req.user._id);
      const check = canUploadProduct(seller);
      if (!check.allowed) {
        res.status(403);
        throw new Error(check.message);
      }
    }

    const { 
      name, price, discount, description, images, brand, category, subcategory, countInStock, sku, specs, variants, productVideo
    } = req.body;
    
    const product = new Product({
      name: name || 'Sample name',
      price: price || 0,
      discount: discount || 0,
      user: req.user._id,
      seller: req.user.role === 'seller' ? req.user._id : (req.body.seller || req.user._id),
      images: images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'],
      brand: brand || 'Sample brand',
      category: category || 'Sample category',
      subcategory: subcategory,
      countInStock: countInStock || 0,
      sku: sku,
      specs: specs || [],
      variants: variants || [],
      numReviews: 0,
      status: 'Pending',
      description: description || 'Sample description',
      productVideo,
    });

    const createdProduct = await product.save();

    if (req.user.role === 'seller') {
      const count = await syncProductsUploaded(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { productsUploaded: count });
    }

    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Seller
const updateProduct = async (req, res, next) => {
  try {
    const { 
      name, price, discount, description, images, brand, category, subcategory, countInStock, sku, specs, variants, productVideo
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check ownership if seller
      if (req.user.role === 'seller' && product.seller?.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this product');
      }
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.discount = discount !== undefined ? discount : product.discount;
      product.description = description || product.description;
      product.images = images || product.images;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.subcategory = subcategory || product.subcategory;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.sku = sku || product.sku;
      product.specs = specs || product.specs;
      product.variants = variants || product.variants;
      product.productVideo = productVideo !== undefined ? productVideo : product.productVideo;
      
      // Reset status to Pending if it was Rejected and re-submitted
      if (product.status === 'Rejected') {
        product.status = 'Pending';
        product.rejectionReason = undefined;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Seller
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check ownership if seller
      if (req.user.role === 'seller' && product.seller?.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this product');
      }
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        images: images || [],
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'Approved' }).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews
// @route   GET /api/products/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const products = await Product.find({}).select('name reviews');
    const allReviews = products.reduce((acc, product) => {
      const reviewsWithProductName = product.reviews.map(r => ({
        ...r._doc,
        productName: product.name,
        productId: product._id
      }));
      return [...acc, ...reviewsWithProductName];
    }, []);
    res.json(allReviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (product) {
      product.reviews = product.reviews.filter(r => r._id.toString() !== req.params.reviewId);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.length > 0 
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length 
        : 0;
      await product.save();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

const getSimilarProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const baseQuery = {
      _id: { $ne: product._id },
      category: product.category,
      status: 'Approved',
    };

    let candidates = await Product.find({
      ...baseQuery,
      ...buildSubcategoryFilter(product.subcategory),
    }).limit(30);

    if (candidates.length < 4) {
      const more = await Product.find(baseQuery).limit(30);
      const merged = [...candidates, ...more];
      candidates = merged;
    }

    let similarProducts = rankSimilarProducts(candidates, product, 8);

    if (similarProducts.length < 4) {
      const broad = await Product.find(baseQuery).limit(30);
      similarProducts = rankSimilarProducts(
        [...similarProducts, ...broad],
        product,
        8
      );
    }

    if (similarProducts.length === 0 && product.subcategory) {
      const fallback = await Product.find({
        _id: { $ne: product._id },
        subcategory: product.subcategory,
        status: 'Approved',
      }).limit(16);
      similarProducts = rankSimilarProducts(fallback, product, 8);
    }

    res.json(similarProducts);
  } catch (error) {
    next(error);
  }
};

const getStyleWithProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const slots = getOutfitSlots(product);
    let styleProducts = await fetchOutfitBySlots(Product, product, slots, 8);

    if (styleProducts.length < 4) {
      const outfitCategories = getOutfitCategories(product.category);
      const fallback = await Product.find({
        _id: { $ne: product._id },
        category: { $in: outfitCategories },
        status: 'Approved',
        ...buildSubcategoryFilter(product.subcategory),
      })
        .sort({ rating: -1 })
        .limit(12);
      const used = new Set(styleProducts.map((p) => p._id.toString()));
      for (const item of fallback) {
        if (styleProducts.length >= 8) break;
        if (!used.has(item._id.toString())) {
          used.add(item._id.toString());
          styleProducts.push(item);
        }
      }
    }

    if (styleProducts.length === 0) {
      styleProducts = await Product.find({
        _id: { $ne: product._id },
        category: { $ne: product.category },
        status: 'Approved',
      })
        .sort({ rating: -1 })
        .limit(8);
    }

    res.json(styleProducts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getAllReviews,
  deleteReview,
  getSimilarProducts,
  getStyleWithProducts,
};

