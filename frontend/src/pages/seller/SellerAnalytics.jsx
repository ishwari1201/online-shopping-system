import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';

const SellerAnalytics = () => {
  const data = [
    { name: 'Jan', sales: 4000, views: 2400 },
    { name: 'Feb', sales: 3000, views: 1398 },
    { name: 'Mar', sales: 2000, views: 9800 },
    { name: 'Apr', sales: 2780, views: 3908 },
    { name: 'May', sales: 1890, views: 4800 },
    { name: 'Jun', sales: 2390, views: 3800 },
  ];

  const categoryData = [
    { name: 'Clothes', value: 400 },
    { name: 'Shoes', value: 300 },
    { name: 'Accessories', value: 200 },
  ];

  const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Store Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Detailed performance metrics for your marketplace business.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-white text-gray-700 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Calendar size={16} /> Last 30 Days
            </button>
          </div>
        </div>

        {/* Small KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Store Views</p>
              <h4 className="text-2xl font-bold text-gray-900">28,490</h4>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Conversion Rate</p>
              <h4 className="text-2xl font-bold text-gray-900">4.2%</h4>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex items-center gap-5">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Repeat Customers</p>
              <h4 className="text-2xl font-bold text-gray-900">18%</h4>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sales vs Views Line Chart */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart2 size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sales vs Views</h3>
            </div>
            <div className="h-[300px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 6px -1px rgb(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Distribution Pie Chart */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center">
                <PieIcon size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Inventory Share</h3>
            </div>
            <div className="h-[260px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm font-semibold text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
