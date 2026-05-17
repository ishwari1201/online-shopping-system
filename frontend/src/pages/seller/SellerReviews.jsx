import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Star, 
  MessageSquare, 
  Package, 
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SellerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/seller/products');
      const allReviews = data.reduce((acc, product) => {
        return [...acc, ...(product.reviews || []).map(r => ({ ...r, productName: product.name, productId: product._id }))];
      }, []);
      setReviews(allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Read and analyze customer feedback for your products.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Aggregated Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] text-center">
              <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Store Rating</h4>
              <div className="text-5xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="flex justify-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" stroke="none" />)}
              </div>
              <p className="text-gray-500 text-xs font-semibold">Based on {reviews.length} reviews</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] space-y-4">
              <h4 className="text-gray-900 font-bold text-sm mb-4">Rating Breakdown</h4>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600 w-4">{star}</span>
                  <Star size={12} className="text-amber-400" fill="currentColor" stroke="none" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Reviews List */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white border border-gray-200 p-16 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] text-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <MessageSquare size={24} />
                </div>
                <p className="text-gray-900 font-bold text-lg mb-1">No reviews yet</p>
                <p className="text-gray-500 text-sm">When customers review your products, they'll appear here.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <motion.div 
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg flex-shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold">{review.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke={i < review.rating ? "none" : "currentColor"} className={i < review.rating ? "" : "text-gray-300"} />
                            ))}
                          </div>
                          <span className="text-[11px] text-gray-400 font-semibold">• {new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-100 w-fit">
                      <Package size={14} /> {review.productName}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">"{review.comment}"</p>
                  
                  <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                    <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                      <MessageSquare size={16} /> Reply
                    </button>
                    <button className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-100 rounded-lg">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerReviews;
