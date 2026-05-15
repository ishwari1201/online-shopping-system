import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Search, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders', { withCredentials: true });
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const { data } = await axios.get('/api/admin/delivery');
      setDeliveryPartners(data.filter(p => p.deliveryStatus === 'approved'));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  const assignHandler = async (orderId, partnerId) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/assign`, { deliveryBoyId: partnerId });
      toast.success('Delivery partner assigned');
      fetchOrders();
    } catch (err) {
      toast.error('Assignment failed');
    }
  };

  const deliverHandler = async (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await axios.put(`/api/orders/${id}/deliver`);
        toast.success('Order marked as delivered');
        fetchOrders();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Update failed');
      }
    }
  };

  if (loading && orders.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Orders Management</h1>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-slate-800/50 text-xs uppercase text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Delivery Partner</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {Array.isArray(orders) && orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{order._id.substring(18)}</td>
                  <td className="px-6 py-4 font-medium text-white">{order.user?.name || 'Guest'}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold text-white">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {order.isDelivered ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">Delivered</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500 uppercase">{order.deliveryStatus || 'Pending'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {!order.isDelivered && (
                      <select 
                        className="bg-slate-800 text-white text-xs rounded border border-slate-700 p-1 outline-none"
                        value={order.deliveryBoy || ''}
                        onChange={(e) => assignHandler(order._id, e.target.value)}
                      >
                        <option value="">Assign Partner</option>
                        {deliveryPartners.map(p => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    )}
                    {order.deliveryBoy && order.isDelivered && (
                      <span className="text-xs text-gray-500">Partner Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-white transition-colors" title="View Details"><Eye size={18} /></button>
                    {!order.isDelivered && (
                      <button 
                        onClick={() => deliverHandler(order._id)}
                        className="text-primary-400 hover:text-primary-300 transition-colors" 
                        title="Mark as Delivered"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
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

export default AdminOrders;
