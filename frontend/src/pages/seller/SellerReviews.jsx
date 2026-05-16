import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Star, 
  MessageSquare, 
  User, 
  Package, 
  Clock, 
  ChevronRight,
  Filter,
  Search
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
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Customer Reviews</h1>
        <p className="text-gray-400 text-sm">Read and analyze feedback for your products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl text-center">
            <h4 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4">Store Rating</h4>
            <div className="text-5xl font-black text-white mb-2">4.8</div>
            <div className="flex justify-center gap-1 text-accent mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-gray-500 text-xs">Based on {reviews.length} reviews</p>
          </div>
          
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl space-y-4">
            <h4 className="text-white font-bold text-sm mb-4">Rating Breakdown</h4>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-4">
                <span className="text-xs text-gray-400 w-4">{star}</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent" 
                    style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-slate-900 border border-white/5 p-20 rounded-[2rem] text-center">
              <p className="text-gray-500 font-bold">No reviews yet for your products.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div 
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{review.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-accent">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-700"} />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">• {new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-primary-500/10 text-primary-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Package size={12} /> {review.productName}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">"{review.comment}"</p>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <button className="text-xs text-primary-500 font-bold hover:underline flex items-center gap-2">
                    <MessageSquare size={14} /> Reply to Review
                  </button>
                  <button className="text-gray-600 hover:text-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerReviews;
