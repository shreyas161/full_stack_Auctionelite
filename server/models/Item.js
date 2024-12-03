const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingPrice: { 
    type: Number, 
    required: true,
    min: 0,
    get: v => `₹${v.toLocaleString('en-IN')}` 
  },
  currentPrice: { 
    type: Number, 
    required: true,
    min: 0,
    get: v => `₹${v.toLocaleString('en-IN')}` 
  },
  auctionDate: { type: Date, required: true },
  images: [String],
  category: { type: String, required: true },
  location: { type: String, required: true },
  seller: { type: String, required: true },
  condition: { type: String, required: true },
  auctionDuration: { type: String, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  registeredBidders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bidHistory: [{
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: { 
      type: Number,
      get: v => `₹${v.toLocaleString('en-IN')}` 
    },
    timestamp: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true,
  toJSON: { getters: true }
});

module.exports = mongoose.model('Item', itemSchema); 