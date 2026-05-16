import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import OrderDetails from './pages/OrderDetails';
import MyOrders from './pages/MyOrders';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSellers from './pages/admin/AdminSellers';
import AdminDelivery from './pages/admin/AdminDelivery';
import AdminProductModeration from './pages/admin/AdminProductModeration';
import AdminSettings from './pages/admin/AdminSettings';
import AdminNotifications from './pages/admin/AdminNotifications';

// Seller Imports
import SellerLayout from './components/seller/SellerLayout';
import SellerRoute from './components/seller/SellerRoute';
import SellerRegister from './pages/SellerRegister';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerInventory from './pages/seller/SellerInventory';
import SellerEarnings from './pages/seller/SellerEarnings';
import SellerProfile from './pages/seller/SellerProfile';
import SellerNotifications from './pages/seller/SellerNotifications';
import SellerAddProduct from './pages/seller/SellerAddProduct';
import SellerEditProduct from './pages/seller/SellerEditProduct';
import SellerSettings from './pages/seller/SellerSettings';
import SellerAnalytics from './pages/seller/SellerAnalytics';
import SellerReviews from './pages/seller/SellerReviews';


// Delivery Imports
import DeliveryLayout from './components/delivery/DeliveryLayout';
import DeliveryRoute from './components/delivery/DeliveryRoute';
import DeliveryRegister from './pages/DeliveryRegister';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import DeliveryOrders from './pages/delivery/DeliveryOrders';
import DeliveryHistory from './pages/delivery/DeliveryHistory';
import DeliveryEarnings from './pages/delivery/DeliveryEarnings';
import DeliveryProfile from './pages/delivery/DeliveryProfile';
import DeliverySettings from './pages/delivery/DeliverySettings';
import DeliveryNotifications from './pages/delivery/DeliveryNotifications';
import DeliveryOrderDetails from './pages/delivery/DeliveryOrderDetails';



import Footer from './components/Footer';

// Layout Component
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const PublicLayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const AdminLayoutWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

const SellerLayoutWrapper = () => (
  <SellerLayout>
    <Outlet />
  </SellerLayout>
);

const DeliveryLayoutWrapper = () => (
  <DeliveryLayout>
    <Outlet />
  </DeliveryLayout>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayoutWrapper />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="products/pending" element={<AdminProductModeration />} />
            <Route path="products/approved" element={<AdminProductModeration />} />
            <Route path="products/rejected" element={<AdminProductModeration />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Seller Routes */}
        <Route path="/seller" element={<SellerRoute />}>
          <Route element={<SellerLayoutWrapper />}>
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="add-product" element={<SellerAddProduct />} />
            <Route path="edit-product/:id" element={<SellerEditProduct />} />
            <Route path="inventory" element={<SellerInventory />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="earnings" element={<SellerEarnings />} />
            <Route path="analytics" element={<SellerAnalytics />} />
            <Route path="reviews" element={<SellerReviews />} />
            <Route path="profile" element={<SellerProfile />} />
            <Route path="notifications" element={<SellerNotifications />} />
            <Route path="settings" element={<SellerSettings />} />
            <Route index element={<SellerDashboard />} />
          </Route>
        </Route>

        {/* Delivery Routes */}
        <Route path="/delivery" element={<DeliveryRoute />}>
          <Route element={<DeliveryLayoutWrapper />}>
            <Route path="dashboard" element={<DeliveryDashboard />} />
            <Route path="orders" element={<DeliveryOrders />} />
            <Route path="order/:id" element={<DeliveryOrderDetails />} />
            <Route path="history" element={<DeliveryHistory />} />
            <Route path="earnings" element={<DeliveryEarnings />} />
            <Route path="profile" element={<DeliveryProfile />} />
            <Route path="settings" element={<DeliverySettings />} />
            <Route path="notifications" element={<DeliveryNotifications />} />
            <Route index element={<DeliveryDashboard />} />
          </Route>
        </Route>

        {/* Public/Customer Routes */}
        <Route element={<PublicLayoutWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/delivery/register" element={<DeliveryRegister />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<AdminNotifications />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
