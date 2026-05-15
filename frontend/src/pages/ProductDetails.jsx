import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, ArrowLeft, Plus, Minus, ShoppingBag, Heart, MapPin, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { shippingAddress } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const isWishlisted = wishlistItems.find((x) => x._id === id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        rating,
        comment,
        images: reviewImage ? [reviewImage] : []
      };
      await axios.post(`/api/products/${id}/reviews`, reviewData);
      toast.success('Review submitted successfully!');
      
      // Refresh product data
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      
      // Reset form
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
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load product details');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty, image: product.images[0] }));
    toast.success('Added to Cart');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/shop" className="text-primary-400 hover:text-primary-300 flex items-center gap-2 text-sm font-medium transition-colors w-max">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            
            {/* Product Images Gallery */}
            <div className="w-full lg:w-1/2 p-6">
              <div className="flex flex-col-reverse sm:flex-row gap-4 h-full">
                {/* Thumbnails */}
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto w-full sm:w-24 flex-shrink-0">
                  {product.images?.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative rounded-xl overflow-hidden aspect-square flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-primary-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                
                {/* Main Image */}
                <div className="flex-1 rounded-2xl overflow-hidden bg-slate-800 relative group aspect-square sm:aspect-auto">
                  {product.images && product.images.length > 0 && (
                    <motion.img 
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      src={product.images[activeImage]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Zoom hint */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="glass px-4 py-2 rounded-full text-white text-sm font-medium">Hover to zoom</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-slate-800/30">
              <div className="mb-2 text-sm font-bold tracking-wider text-primary-500 uppercase">{product.brand}</div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.floor(product.rating || 0) ? "fill-current" : "text-slate-600"} />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({product.numReviews} Reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-white">
                  ${product.price} <span className="text-sm text-gray-500 font-normal line-through ml-2">${(product.price * 1.3).toFixed(2)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  product.countInStock > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-medium">Size</h3>
                  <button className="text-primary-400 text-sm hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center font-medium transition-all ${
                        selectedSize === size 
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400' 
                        : 'border-slate-700 text-gray-400 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 h-14">
                  <button 
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center text-white font-semibold">{qty}</span>
                  <button 
                    onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <button 
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`flex-1 font-bold rounded-xl h-14 flex items-center justify-center gap-2 shadow-lg transition-all ${
                    product.countInStock > 0 
                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-500/20 hover:-translate-y-1' 
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ShoppingBag size={20} /> {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                <button 
                  onClick={() => {
                    dispatch(toggleWishlist({ _id: product._id, name: product.name, price: product.price, image: product.images[0] }));
                    toast.info(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
                  }}
                  className={`h-14 w-14 flex items-center justify-center rounded-xl border transition-all ${
                    isWishlisted 
                    ? 'border-red-500 bg-red-500/10 text-red-500' 
                    : 'border-slate-700 text-gray-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10'
                  }`}
                >
                  <Heart size={24} className={isWishlisted ? "fill-current" : ""} />
                </button>
              </div>

              {/* Delivery & Returns Widget */}
              <div className="mt-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                
                <div className="flex gap-4 items-start mb-6 pb-6 border-b border-slate-700/50">
                  <div className="text-primary-500 mt-1"><MapPin size={24} /></div>
                  <div>
                    <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                      Deliver to <span className="text-primary-400 font-bold">{shippingAddress?.postalCode || 'New York 10001'}</span>
                    </h4>
                    <Link to="/shipping" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">Change Delivery Address</Link>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="text-green-500"><Truck size={24} /></div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Free Delivery</h4>
                      <p className="text-sm text-gray-400">
                        Estimated arrival by <span className="text-green-400 font-bold">Tuesday, May 20</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="text-accent"><RefreshCw size={24} /></div>
                    <div>
                      <h4 className="text-white font-medium mb-1">10 Days Return Policy</h4>
                      <p className="text-sm text-gray-400">
                        Hassle-free returns within 10 days of delivery.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="text-purple-500"><ShieldCheck size={24} /></div>
                    <div>
                      <h4 className="text-white font-medium mb-1">1 Year Warranty</h4>
                      <p className="text-sm text-gray-400">
                        Covered by Wearify premium guarantee.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 lg:p-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Reviews Summary & List */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-8">Customer Reviews</h2>
              
              {product.reviews.length === 0 ? (
                <div className="bg-slate-800/50 rounded-2xl p-8 text-center text-gray-400 border border-dashed border-slate-700">
                  No reviews yet. Be the first to share your thoughts!
                </div>
              ) : (
                <div className="space-y-8">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="pb-8 border-b border-slate-800 last:border-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-bold text-white mb-1">{review.name}</div>
                          <div className="flex items-center text-accent">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-slate-700"} />
                            ))}
                            <span className="ml-3 text-xs text-gray-500 font-medium">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">{review.comment}</p>
                      
                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {review.images.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              alt="Review" 
                              className="w-24 h-24 rounded-xl object-cover border border-slate-700 hover:scale-105 transition-transform cursor-zoom-in" 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="w-full lg:w-96">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 sticky top-28">
                <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>
                
                {userInfo ? (
                  <form className="space-y-4" onSubmit={submitReviewHandler}>
                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-1 transition-colors ${rating >= star ? 'text-accent' : 'text-slate-600 hover:text-accent'}`}
                          >
                            <Star size={24} className={rating >= star ? "fill-current" : ""} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-2">Comment</label>
                      <textarea
                        required
                        rows="4"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-all resize-none"
                        placeholder="What did you like or dislike?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-2">Review Photo URL (Optional)</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-all"
                        placeholder="Paste image link here..."
                        value={reviewImage}
                        onChange={(e) => setReviewImage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/20 transition-all"
                    >
                      Post Review
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-4">Please log in to write a review.</p>
                    <Link 
                      to="/login" 
                      className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                      Login Now
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
