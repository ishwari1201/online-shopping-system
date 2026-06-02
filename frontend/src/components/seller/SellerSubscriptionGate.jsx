import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import SellerPendingApproval from '../../pages/seller/SellerPendingApproval';

const SellerSubscriptionGate = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userInfo || userInfo.role === 'admin') {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('/api/seller/subscription/status', {
          withCredentials: true,
        });
        setStatus(data);
      } catch {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userInfo, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#fff7fa]">
        <div className="w-8 h-8 border-2 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (userInfo?.role === 'admin') return <Outlet />;

  if (!status || status.sellerStatus !== 'approved') {
    return <SellerPendingApproval status={status} />;
  }

  const onSubscriptionPage = location.pathname.includes('/seller/subscription');

  if (!status.isSellerActive && !onSubscriptionPage) {
    return <Navigate to="/seller/subscription" replace />;
  }

  if (status.isSellerActive && onSubscriptionPage) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return <Outlet />;
};

export default SellerSubscriptionGate;
