const mongoose = require('mongoose');

const subscriptionPaymentSchema = mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paymentId: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubscriptionPayment', subscriptionPaymentSchema);
