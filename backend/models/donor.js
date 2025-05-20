const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bloodType: String,
  age: Number,
  dob: Date,
  lastDonationDate: Date,
  patientCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Donor', donorSchema);