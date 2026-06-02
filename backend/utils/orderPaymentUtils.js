const User = require('../models/userModel');
const Product = require('../models/productModel');
const Notification = require('../models/notificationModel');

const buildCommissionedOrderItems = async (rawItems) => {
  const sellerIds = [
    ...new Set(
      rawItems.map((item) => (item.seller || item.user)?.toString()).filter(Boolean)
    ),
  ];

  const sellers = await User.find({ _id: { $in: sellerIds } }).select(
    'commissionRate isSellerActive'
  );
  const sellerMap = new Map(sellers.map((s) => [s._id.toString(), s]));

  let orderAdminCommission = 0;
  let orderSellerEarning = 0;

  const orderItems = rawItems.map((item) => {
    const sellerId = (item.seller || item.user)?.toString();
    const seller = sellerMap.get(sellerId);
    const rate = seller?.commissionRate > 0 ? seller.commissionRate : 10;
    const qty = Number(item.qty) || 1;
    const price = Number(item.price) || 0;
    const lineTotal = price * qty;
    const adminCommission = Math.round((lineTotal * rate) / 100);
    const sellerEarning = lineTotal - adminCommission;

    orderAdminCommission += adminCommission;
    orderSellerEarning += sellerEarning;

    return {
      name: item.name,
      qty,
      image: item.image,
      price,
      product: item._id || item.product,
      seller: sellerId,
      lineTotal,
      adminCommission,
      sellerEarning,
    };
  });

  return { orderItems, orderAdminCommission, orderSellerEarning, sellerMap };
};

const creditSellerWallets = async (orderItems) => {
  const earningsBySeller = {};

  orderItems.forEach((item) => {
    const sid = item.seller?.toString();
    if (!sid) return;
    earningsBySeller[sid] = (earningsBySeller[sid] || 0) + (item.sellerEarning || 0);
  });

  await Promise.all(
    Object.entries(earningsBySeller).map(([sellerId, amount]) =>
      User.findByIdAndUpdate(sellerId, { $inc: { walletBalance: amount } })
    )
  );
};

const reduceInventoryAndNotify = async (createdOrder, customerName) => {
  for (const item of createdOrder.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock -= item.qty;
      if (product.countInStock <= 0) {
        product.countInStock = 0;
        product.status = 'OutOfStock';
      }
      await product.save();

      await Notification.create({
        user: product.seller || product.user,
        title: 'New Order Received',
        message: `Order #${createdOrder._id} for ${item.name} placed successfully.`,
        type: 'success',
      });
    }
  }

  const adminUser = await User.findOne({ role: 'admin' });
  if (adminUser) {
    await Notification.create({
      user: adminUser._id,
      order: createdOrder._id,
      title: 'New Order Received',
      message: `Customer ${customerName} placed a new order of ₹${createdOrder.totalPrice}`,
      type: 'success',
    });
  }
};

module.exports = {
  buildCommissionedOrderItems,
  creditSellerWallets,
  reduceInventoryAndNotify,
};
