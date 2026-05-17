import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Search, 
  Trash2, 
  ShieldAlert, 
  Shield, 
  Mail, 
  Calendar,
  UserCheck,
  UserX,
  Store,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlockHandler = async (id) => {
    try {
      await axios.patch(`/api/admin/users/${id}/status`);
      toast.success('User status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Control platform access and manage account status</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'customers' 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users size={14} className="text-gray-900" /> Customers
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-xl border border-gray-200 text-xs font-bold shadow-sm">
              <UserCheck size={14} className="text-green-600" />
              Active: {users.filter(u => !u.isBlocked).length}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs font-bold">
              <UserX size={14} />
              Blocked: {users.filter(u => u.isBlocked).length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-gray-100">
                <th className="px-8 py-5">User Account</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-bold">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-black text-sm border border-gray-200">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            {user.name}
                            {user.isAdmin && <Shield size={14} className="text-primary-600" />}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{user.role}</span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-500 flex items-center gap-1.5 mt-4">
                      <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        user.isBlocked 
                          ? 'bg-red-50 text-red-600 border-red-200' 
                          : 'bg-green-50 text-green-600 border-green-200'
                      }`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleBlockHandler(user._id)}
                          className={`p-2.5 rounded-xl transition-all border border-transparent shadow-sm ${
                            user.isBlocked 
                              ? 'text-green-600 hover:bg-green-50 hover:border-green-100' 
                              : 'text-red-600 hover:bg-red-50 hover:border-red-100'
                          }`}
                          title={user.isBlocked ? 'Unblock' : 'Block'}
                        >
                          {user.isBlocked ? <Shield size={18} /> : <ShieldAlert size={18} />}
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100">
                          <Trash2 size={18} />
                        </button>
                      </div>
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

export default AdminUsers;
