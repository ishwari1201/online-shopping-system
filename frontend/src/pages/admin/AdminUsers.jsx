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
          <h1 className="text-2xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-gray-400 text-sm">Control platform access and manage account status</p>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'customers' 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={14} /> Customers
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full bg-slate-800 text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-400 rounded-xl border border-white/5 text-xs font-bold">
              <UserCheck size={14} />
              Active: {users.filter(u => !u.isBlocked).length}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-xs font-bold">
              <UserX size={14} />
              Blocked: {users.filter(u => u.isBlocked).length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">User Account</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5">Status</th>
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-bold">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-white font-black text-sm border border-white/5">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white flex items-center gap-2">
                            {user.name}
                            {user.isAdmin && <Shield size={14} className="text-primary-500" />}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1.5"><Mail size={12} /> {user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.role}</span>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-500 flex items-center gap-1.5 mt-4">
                      <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        user.isBlocked 
                          ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                          : 'bg-green-500/10 text-green-500 border-green-500/20'
                      }`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleBlockHandler(user._id)}
                          className={`p-2.5 rounded-xl transition-all ${
                            user.isBlocked 
                              ? 'text-green-500 hover:bg-green-500/10' 
                              : 'text-red-400 hover:bg-red-500/10'
                          }`}
                          title={user.isBlocked ? 'Unblock' : 'Block'}
                        >
                          {user.isBlocked ? <Shield size={18} /> : <ShieldAlert size={18} />}
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
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
