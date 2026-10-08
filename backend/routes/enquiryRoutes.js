const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// @route   POST /api/enquiries
// @desc    Submit a new enquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, projectType, budget, message } = req.body;

    if (!name || !email || !phone || !projectType || !budget) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const newEnquiry = await Enquiry.create({ name, email, phone, projectType, budget, message });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted successfully.',
      data: newEnquiry
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// @route   GET /api/enquiries
// @desc    Get all submitted enquiries (For Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries.' });
  }
});

// @route   DELETE /api/enquiries/:id
// @desc    Delete an enquiry by ID (For Admin Dashboard)
router.delete('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    res.status(200).json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete enquiry.' });
  }
});

module.exports = router;