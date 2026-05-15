import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Trash2, Search, Package } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products/reviews');
      setReviews(data);
    } catch (error) {
      console.error(error);
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
        toast.success('Review removed');
        fetchReviews();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  if (loading && reviews.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Review Management</h1>
        <div className="text-sm text-gray-400">Total Reviews: {reviews.length}</div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Search by product or user..." 
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-slate-800/50 text-xs uppercase text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Comment</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {Array.isArray(reviews) && reviews.map((review) => (
                <tr key={review._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{review.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-gray-500" />
                      <span className="truncate max-w-[150px]">{review.productName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-accent">
                      <Star size={14} className="fill-current mr-1" />
                      {review.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 italic text-gray-300 max-w-xs truncate">
                    "{review.comment}"
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteHandler(review.productId, review._id)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-2"
                      title="Delete Review"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
