const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'seller', 'delivery'], default: 'customer' },
  avatar: { type: String, default: '' },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  // Seller specific fields
  sellerProfile: {
    storeName: { type: String },
    ownerName: { type: String },
    phone: { type: String },
    gstNumber: { type: String },
    address: { type: String },
    storeLogo: { type: String },
    storeBanner: { type: String },
    description: { type: String },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String
    }
  },
  isSellerApproved: { type: Boolean, default: false },
  sellerStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'blocked'], default: 'pending' },

  // Delivery specific fields
  deliveryProfile: {
    phone: { type: String },
    address: { type: String },
    vehicleType: { type: String, enum: ['Bike', 'Scooter', 'Car', 'Van'] },
    vehicleNumber: { type: String },
    drivingLicense: { type: String },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 5 },
    totalDeliveries: { type: Number, default: 0 }
  },
  isDeliveryApproved: { type: Boolean, default: false },
  deliveryStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'blocked'], default: 'pending' },
}, {
  timestamps: true
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
