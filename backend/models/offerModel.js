const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  offerName: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    unique: true 
  },
  description: { 
    type: String 
  },
  bannerImage: { 
    type: String 
  },
  couponCode: { 
    type: String 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Expired'],
    default: 'Draft',
  },
}, {
  timestamps: true,
});

// Pre-save hook to generate a clean, unique URL slug from the offerName
offerSchema.pre('save', function () {
  if (this.isModified('offerName') || !this.slug) {
    const slugify = (text) => text.toString().toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    const baseSlug = slugify(this.offerName) || 'offer';
    // Append a 4-character random alphanumeric code to guarantee slug uniqueness
    const uniqueHash = Math.random().toString(36).substring(2, 6);
    this.slug = `${baseSlug}-${uniqueHash}`;
  }
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
