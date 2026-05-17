import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Tags, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Image as ImageIcon,
  FolderTree,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await axios.put(`/api/categories/${editCategory._id}`, { name, description, image });
        toast.success('Category updated');
      } else {
        await axios.post('/api/categories', { name, description, image });
        toast.success('Category created');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Action failed');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage('');
    setEditCategory(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Category Management</h1>
          <p className="text-gray-500 text-sm">Organize products into logical groups</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} className="text-gray-900" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : categories.map((cat) => (
          <motion.div 
            key={cat._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden hover:border-gray-300 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="h-48 relative overflow-hidden bg-gray-100">
              <img 
                src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => { setEditCategory(cat); setName(cat.name); setDescription(cat.description); setImage(cat.image); setShowModal(true); }}
                  className="p-2 bg-white text-gray-700 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => deleteHandler(cat._id)}
                  className="p-2 bg-white text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg border border-primary-100">
                  <Tags size={16} />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">{cat.name}</h3>
              </div>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{cat.description || 'No description provided.'}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <FolderTree size={12} /> Root Category
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white border border-gray-200 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-xl"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  {editCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
              </div>
              <form onSubmit={submitHandler} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="e.g. Men's Fashion"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="https://images.unsplash.com/..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <ImageIcon className="absolute left-4 top-4 text-gray-500" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows="3"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                    placeholder="Enter category details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all shadow-sm"
                >
                  {editCategory ? 'Update Category' : 'Create Category'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
