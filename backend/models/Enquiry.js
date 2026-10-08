const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  projectType: {
    type: String,
    required: [true, 'Please select a project type'],
    enum: ['Residential', 'Office', 'Kitchen', 'Bedroom', 'Living Room', 'Other']
  },
  budget: {
    type: String,
    required: [true, 'Please select a budget range'],
    enum: ['1L-3L', '3L-5L', '5L-10L', '10L+']
  },
  message: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Enquiry', enquirySchema);