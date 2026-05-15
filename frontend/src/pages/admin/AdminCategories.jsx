import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tags, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/categories', { name, description });
      toast.success('Category created');
      setShowModal(false);
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && categories.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-600/10 rounded-xl text-primary-400">
                <Tags size={24} />
              </div>
              <button 
                onClick={() => deleteHandler(category._id)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">{category.description || 'No description provided'}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add Category</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={submitHandler} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  rows="3"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-500 transition-all disabled:opacity-50 mt-4"
              >
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
