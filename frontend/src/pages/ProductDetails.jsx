import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Truck, Shield, ArrowLeft, Plus, Minus, ShoppingBag, Heart, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);
  const isWishlisted = wishlistItems.find((x) => x._id === id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/products/${id}/reviews`, {
        rating,
        comment,
        images: reviewImage ? [reviewImage] : [],
      });
      toast.success('Review submitted!');
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setRating(5);
      setComment('');
      setReviewImage('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    const mainImage = product.images?.length > 0 ? product.images[0] : '/placeholder.jpg';
    dispatch(addToCart({ ...product, qty, image: mainImage }));
    toast.success('Added to Cart');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex justify-center items-center bg-[#f8f7f5]">
        <div className="w-8 h-8 border-4 border-[#212a2f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#f8f7f5] text-[#212a2f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-10">
          <Link to="/shop" className="flex items-center gap-2 text-gray-400 hover:text-[#212a2f] transition-colors text-[11px] font-black uppercase tracking-widest w-max">
            <ArrowLeft size={14} /> Back to Shop
          </Link>
        </div>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Image Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 w-20 flex-shrink-0">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square overflow-hidden rounded-sm border-2 transition-all ${
                    activeImage === idx ? 'border-[#212a2f]' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-white rounded-sm overflow-hidden relative aspect-[4/5]">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={product.images?.[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.countInStock === 0 && (
                <div className="absolute top-4 left-4 bg-[#212a2f] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  Sold Out
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-8">

            {/* Brand & Name */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">{product.brand || 'Wearify'}</p>
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-4">{product.name}</h1>

              {/* Stars */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating || 0) ? 'fill-[#212a2f] text-[#212a2f]' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 font-medium">({product.numReviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-12">
              <span className="text-3xl font-black tracking-tighter text-primary">₹{product.price}</span>
              <div className="w-px h-6 bg-black/5"></div>
              <span className="text-[11px] font-black uppercase tracking-widest text-muted">Incl. GST</span>
            </div>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed text-sm max-w-md">{product.description}</p>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em]">Select Size</p>
                <button className="text-[11px] font-black uppercase tracking-widest underline underline-offset-4 text-gray-400 hover:text-[#212a2f] transition-colors">Size Guide</button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-[11px] font-black uppercase border transition-all ${
                      selectedSize === size
                        ? 'bg-[#212a2f] text-white border-[#212a2f]'
                        : 'bg-white text-gray-500 border-black/10 hover:border-[#212a2f]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Actions */}
            <div className="flex gap-4">
              {/* Qty */}
              <div className="flex items-center border border-black/10 bg-white">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-400 hover:text-[#212a2f] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-black text-sm">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                  className="px-4 py-3 text-gray-400 hover:text-[#212a2f] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`flex-1 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest py-4 transition-all ${
                  product.countInStock > 0
                    ? 'bg-[#212a2f] text-white hover:bg-[#334148]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={16} />
                {product.countInStock > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  dispatch(toggleWishlist({ _id: product._id, name: product.name, price: product.price, image: product.images?.[0] }));
                  toast.info(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
                }}
                className={`w-14 flex items-center justify-center border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-300 text-red-500'
                    : 'bg-white border-black/10 text-gray-400 hover:border-red-300 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-black/5 pt-8 grid grid-cols-3 gap-4">
              {[
                { icon: <Truck size={20} />, label: 'Free Delivery', sub: 'Orders over $100' },
                { icon: <RefreshCw size={20} />, label: '30-Day Returns', sub: 'Hassle-free' },
                { icon: <Shield size={20} />, label: '1 Year Warranty', sub: 'Premium quality' },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center text-center gap-2">
                  <div className="text-gray-400">{badge.icon}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest">{badge.label}</p>
                  <p className="text-[10px] text-gray-400">{badge.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 border-t border-black/5 pt-16">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-12 text-center">Customer Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Reviews List */}
            <div className="space-y-8">
              {product.reviews?.length === 0 ? (
                <div className="bg-white border border-black/5 rounded-sm p-12 text-center">
                  <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
                </div>
              ) : (
                product.reviews?.map((review) => (
                  <div key={review._id} className="border-b border-black/5 pb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'fill-[#212a2f] text-[#212a2f]' : 'text-gray-200'} />
                        ))}
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest">{review.name}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    {review.images?.length > 0 && (
                      <div className="flex gap-3 mt-4">
                        {review.images.map((img, idx) => (
                          <img key={idx} src={img} alt="Review" className="w-20 h-20 object-cover rounded-sm border border-black/5" />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Write a Review */}
            <div>
              <div className="bg-white border border-black/5 rounded-sm p-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-8 border-b border-black/5 pb-4">Write a Review</h3>
                {userInfo ? (
                  <form className="space-y-6" onSubmit={submitReviewHandler}>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`transition-colors ${rating >= star ? 'text-[#212a2f]' : 'text-gray-300 hover:text-gray-400'}`}
                          >
                            <Star size={22} className={rating >= star ? 'fill-current' : ''} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Comment</label>
                      <textarea
                        required
                        rows="4"
                        className="w-full bg-[#f8f7f5] border border-black/5 rounded-sm px-4 py-3 text-sm text-[#212a2f] focus:outline-none focus:border-[#212a2f] transition-all resize-none"
                        placeholder="What did you think of this product?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Photo URL (Optional)</label>
                      <input
                        type="text"
                        className="w-full bg-[#f8f7f5] border border-black/5 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#212a2f] transition-all"
                        placeholder="Paste image URL..."
                        value={reviewImage}
                        onChange={(e) => setReviewImage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#212a2f] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#334148] transition-all"
                    >
                      Post Review
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400 mb-6">Please log in to write a review.</p>
                    <Link
                      to="/login"
                      className="inline-block px-8 py-3 bg-[#212a2f] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#334148] transition-all"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
