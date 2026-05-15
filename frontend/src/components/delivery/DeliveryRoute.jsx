import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const DeliveryRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.role === 'delivery' && userInfo.deliveryStatus === 'pending') {
      toast.info('Your delivery account is pending approval. You will receive orders once approved.');
    }
  }, [userInfo]);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.role !== 'delivery' && userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default DeliveryRoute;
