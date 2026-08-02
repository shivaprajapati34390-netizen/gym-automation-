const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contact: { type: String, required: true },
  membershipType: { type: String, enum: ['Monthly', 'Yearly'], required: true },
  joinDate: { type: Date, default: Date.now },
  expiryOverride: { type: Date, default: null },
});
module.exports = mongoose.model('Member', memberSchema);
