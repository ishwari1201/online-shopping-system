const Offer = require('../models/offerModel');
const OfferProduct = require('../models/offerProductModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Helper function to dynamically check and mark expired offers in the database
const updateExpiredOffers = async () => {
  try {
    const now = new Date();
    await Offer.updateMany(
      { 
        endDate: { $lt: now }, 
        status: { $in: ['Approved', 'Pending Approval', 'Draft'] } 
      },
      { status: 'Expired' }
    );
  } catch (error) {
    console.error('Error auto-updating expired offers:', error);
  }
};

// @desc    Create a promotional offer
// @route   POST /api/offers
// @access  Private/Seller
const createOffer = async (req, res, next) => {
  console.log('🛠️ createOffer payload →', req.body);
  try {
    const {
      offerName, description, bannerImage, couponCode, startDate, endDate, status, products 
    } = req.body;

    if (!offerName || !startDate || !endDate) {
      res.status(400);
      throw new Error('Please fill in all required fields (Name, Start Date, End Date)');
    }

    if (new Date(endDate) <= new Date(startDate)) {
      res.status(400);
      throw new Error('End date must be after the start date');
    }

    // Default status to Draft or Pending Approval (sellers cannot auto-approve their own offers)
    let finalStatus = 'Draft';
    if (status === 'Pending Approval') {
      finalStatus = 'Pending Approval';
    }

    const offer = new Offer({
      sellerId: req.user._id,
      offerName,
      description,
      bannerImage,
      couponCode,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: finalStatus,
    });

    const createdOffer = await offer.save();

    // Map and save attached products
    if (Array.isArray(products) && products.length > 0) {
      const offerProducts = products.map(prodId => ({
        offerId: createdOffer._id,
        productId: prodId
      }));
      await OfferProduct.insertMany(offerProducts);
    }

    res.status(201).json(createdOffer);
  } catch (error) {
    console.error('⚡ createOffer error →', error);
    next(error);
  }
};

// @desc    Update a promotional offer
// @route   PUT /api/offers/:id
// @access  Private/Seller/Admin
const updateOffer = async (req, res, next) => {
  try {
    console.log('🛠️ updateOffer payload →', req.body);
    try {
      const {
        offerName, description, bannerImage, couponCode, startDate, endDate, status, products 
      } = req.body;

      const offer = await Offer.findById(req.params.id);

      if (!offer) {
        res.status(404);
        throw new Error('Offer not found');
      }

      // Authorization: Only owning seller or admin can edit
      if (req.user.role !== 'admin' && offer.sellerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this offer');
      }

      // If dates are being changed, validate
      const finalStart = startDate ? new Date(startDate) : offer.startDate;
      const finalEnd = endDate ? new Date(endDate) : offer.endDate;

      if (finalEnd <= finalStart) {
        res.status(400);
        throw new Error('End date must be after the start date');
      }

      offer.offerName = offerName || offer.offerName;
      offer.description = description !== undefined ? description : offer.description;
      offer.bannerImage = bannerImage || offer.bannerImage;
      offer.couponCode = couponCode !== undefined ? couponCode : offer.couponCode;
      offer.startDate = finalStart;
      offer.endDate = finalEnd;

      // Manage status transition
      if (status && ['Draft', 'Pending Approval'].includes(status)) {
        offer.status = status;
      } else if (req.user.role === 'admin' && status) {
        // Admin can transition status to Approved, Rejected, etc.
        offer.status = status;
      }

      const updatedOffer = await offer.save();

      // If products array is sent, overwrite relationships
      if (Array.isArray(products)) {
        // 1. Delete all old relations
        await OfferProduct.deleteMany({ offerId: offer._id });

        // 2. Insert new relations
        if (products.length > 0) {
          const offerProducts = products.map(prodId => ({
            offerId: offer._id,
            productId: prodId
          }));
          await OfferProduct.insertMany(offerProducts);
        }
      }

      res.json(updatedOffer);
    } catch (error) {
      console.error('⚡ updateOffer error →', error);
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get offers for logged-in seller
// @route   GET /api/offers/my
// @access  Private/Seller
const getMyOffers = async (req, res, next) => {
  try {
    await updateExpiredOffers();

    const offers = await Offer.find({ sellerId: req.user._id }).sort({ createdAt: -1 });

    // Fetch and count attached products for each offer
    const populatedOffers = await Promise.all(offers.map(async (offer) => {
      const productMappings = await OfferProduct.find({ offerId: offer._id }).populate({
        path: 'productId',
        select: 'name price brand images status'
      });
      return {
        ...offer.toObject(),
        products: productMappings.map(m => m.productId).filter(Boolean)
      };
    }));

    res.json(populatedOffers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get offer by ID
// @route   GET /api/offers/:id
// @access  Private/Seller/Admin
const getOfferById = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('sellerId', 'name email sellerProfile');

    if (!offer) {
      res.status(404);
      throw new Error('Offer not found');
    }

    // Verify ownership
    if (req.user.role !== 'admin' && offer.sellerId._id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to view this offer');
    }

    const productMappings = await OfferProduct.find({ offerId: offer._id }).populate({
      path: 'productId',
      select: 'name price brand images status countInStock sku'
    });

    res.json({
      ...offer.toObject(),
      products: productMappings.map(m => m.productId).filter(Boolean)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Seller/Admin
const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      res.status(404);
      throw new Error('Offer not found');
    }

    // Verify ownership
    if (req.user.role !== 'admin' && offer.sellerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this offer');
    }

    // Delete Offer
    await Offer.deleteOne({ _id: offer._id });

    // Delete related mappings
    await OfferProduct.deleteMany({ offerId: offer._id });

    res.json({ message: 'Offer and its product attachments removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all offers (for Admin Review)
// @route   GET /api/admin/offers
// @access  Private/Admin
const getAllOffers = async (req, res, next) => {
  try {
    await updateExpiredOffers();

    const offers = await Offer.find({})
      .populate('sellerId', 'name email sellerProfile')
      .sort({ createdAt: -1 });

    const populatedOffers = await Promise.all(offers.map(async (offer) => {
      const productMappings = await OfferProduct.find({ offerId: offer._id }).populate('productId');
      return {
        ...offer.toObject(),
        products: productMappings.map(m => m.productId).filter(Boolean)
      };
    }));

    res.json(populatedOffers);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve offer
// @route   PATCH /api/admin/offers/:id/approve
// @access  Private/Admin
const approveOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      res.status(404);
      throw new Error('Offer not found');
    }

    offer.status = 'Approved';
    const approvedOffer = await offer.save();

    res.json(approvedOffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Reject offer
// @route   PATCH /api/admin/offers/:id/reject
// @access  Private/Admin
const rejectOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      res.status(404);
      throw new Error('Offer not found');
    }

    offer.status = 'Rejected';
    const rejectedOffer = await offer.save();

    res.json(rejectedOffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle/Disable offer (sets it to Draft to disable on website)
// @route   PATCH /api/admin/offers/:id/toggle
// @access  Private/Admin
const toggleOfferStatus = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      res.status(404);
      throw new Error('Offer not found');
    }

    if (offer.status === 'Approved') {
      offer.status = 'Draft'; // Disable
    } else if (offer.status === 'Draft' || offer.status === 'Rejected') {
      offer.status = 'Approved'; // Re-enable if dates are valid
    }

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active approved offers (for Homepage slider and public directory)
// @route   GET /api/offers/active
// @access  Public
const getActiveOffers = async (req, res, next) => {
  try {
    await updateExpiredOffers();

    const now = new Date();
    // Only Approved and Active offers appear on the website
    const offers = await Offer.find({
      status: 'Approved',
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
    .populate('sellerId', 'name sellerProfile')
    .sort({ updatedAt: -1 }); // Sort by newest approved first

    const populatedOffers = await Promise.all(offers.map(async (offer) => {
      const count = await OfferProduct.countDocuments({ offerId: offer._id });
      return {
        ...offer.toObject(),
        productCount: count
      };
    }));

    res.json(populatedOffers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get active offer details by slug, with populated products list
// @route   GET /api/offers/slug/:slug
// @access  Public
const getOfferDetailsBySlug = async (req, res, next) => {
  try {
    await updateExpiredOffers();

    const offer = await Offer.findOne({ slug: req.params.slug })
      .populate('sellerId', 'name sellerProfile');

    if (!offer) {
      res.status(404);
      throw new Error('Offer not found');
    }

    // Fetch all products that belong to this offer
    const productMappings = await OfferProduct.find({ offerId: offer._id }).populate({
      path: 'productId',
      match: { status: 'Approved' } // Only show approved products under this offer
    });

    const products = productMappings
      .map(m => m.productId)
      .filter(Boolean); // Eliminate null mappings due to non-approved products

    res.json({
      offer,
      products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOffer,
  updateOffer,
  getMyOffers,
  getOfferById,
  deleteOffer,
  getAllOffers,
  approveOffer,
  rejectOffer,
  toggleOfferStatus,
  getActiveOffers,
  getOfferDetailsBySlug,
};
