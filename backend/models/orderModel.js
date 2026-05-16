const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
    deliveryStatus: { type: String, enum: ['Assigned', 'Accepted', 'Picked Up', 'Out For Delivery', 'Delivered'], default: 'Assigned' },
    deliveryOTP: { type: String },
    otpVerified: { type: Boolean, default: false },
    deliveryTimeline: [
      {
        status: String,
        timestamp: Date,
        description: String
      }
    ],
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  paymentId: { type: String },
  razorpayOrderId: { type: String },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'COD'],
    default: 'Pending',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deliveryStatus: {
    type: String,
    enum: [
      'Pending',
      'Assigned',
      'Accepted',
      'Picked Up',
      'Out For Delivery',
      'Delivered',
      'Failed Delivery',
      'Cancelled',
      'Returned'
    ],
    default: 'Pending'
  },
  deliveryTimeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    description: String
  }],
  failureReason: { type: String },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
