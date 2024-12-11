const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  datePosted: { type: Date, default: Date.now },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Linked to User
});

module.exports = mongoose.model('Listing', ListingSchema);
