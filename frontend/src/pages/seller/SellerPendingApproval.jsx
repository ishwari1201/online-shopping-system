import { Clock, XCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const SellerPendingApproval = ({ status }) => {
  const sellerStatus = status?.sellerStatus || 'pending';

  const config = {
    pending: {
      icon: Clock,
      title: 'Application Under Review',
      message:
        'Your seller application is pending admin approval. You will be able to choose a plan once approved.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    rejected: {
      icon: XCircle,
      title: 'Application Rejected',
      message: 'Your seller application was rejected. Please contact support for assistance.',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    blocked: {
      icon: ShieldAlert,
      title: 'Account Suspended',
      message: 'Your seller account has been suspended by the admin.',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  };

  const c = config[sellerStatus] || config.pending;
  const Icon = c.icon;

  return (
    <div className="min-h-screen bg-[#fff7fa] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#FCE4EC] p-10 text-center shadow-lg">
        <div className={`w-16 h-16 rounded-2xl ${c.bg} flex items-center justify-center mx-auto mb-6`}>
          <Icon className={c.color} size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">{c.title}</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">{c.message}</p>
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-full bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#D81B60] transition-colors"
        >
          Back to Store
        </Link>
      </div>
    </div>
  );
};

export default SellerPendingApproval;
