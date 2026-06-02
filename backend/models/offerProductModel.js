const mongoose = require('mongoose');

const offerProductSchema = mongoose.Schema({
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Offer'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  }
}, {
  timestamps: true
});

// Create a compound index to ensure uniqueness: a single product cannot be linked to the same offer multiple times.
offerProductSchema.index({ offerId: 1, productId: 1 }, { unique: true });

// Create indexes on individual fields for high-performance double-sided joins.
offerProductSchema.index({ offerId: 1 });
offerProductSchema.index({ productId: 1 });

const OfferProduct = mongoose.model('OfferProduct', offerProductSchema);
module.exports = OfferProduct;
