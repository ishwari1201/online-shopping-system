const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  images: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, {
  timestamps: true,
});

const productSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Original creator (admin/seller)
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Specific seller for multi-vendor
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  subcategory: { type: String },
  specs: [{
    key: String,
    value: String
  }],
  variants: [{
    color: String,
    size: String,
    stock: Number,
    price: Number
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Disabled', 'OutOfStock'],
    default: 'Pending',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: {
    type: String,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
