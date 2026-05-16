import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Star, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Search, 
  MessageSquare,
  User,
  Package,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // In a real app, you might have a dedicated reviews endpoint
      const { data } = await axios.get('/api/products');
      // Extract all reviews from all products
      const allReviews = data.products.reduce((acc, product) => {
        return [...acc, ...(product.reviews || []).map(r => ({ ...r, productName: product.name, productId: product._id }))];
      }, []);
      setReviews(allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteHandler = async (productId, reviewId) => {
    if (window.confirm('Delete this review?')) {
      try {
        await axios.delete(`/api/products/${productId}/reviews/${reviewId}`);
        toast.success('Review deleted');
        fetchReviews();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Reviews Moderation</h1>
        <p className="text-gray-400 text-sm">Monitor customer feedback and manage product reviews</p>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search reviews, users or products..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Reviewer / Product</th>
                <th className="px-8 py-5">Rating</th>
                <th className="px-8 py-5">Comment</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-bold">
                    No reviews found
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <User size={14} className="text-gray-500" /> {review.name}
                        </span>
                        <span className="text-[10px] text-primary-500 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                          <Package size={10} /> {review.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < review.rating ? "fill-accent text-accent" : "text-slate-700"} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-gray-400 line-clamp-2 max-w-xs">{review.comment}</p>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => deleteHandler(review.productId, review._id)}
                        className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Delete Review"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
