const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// @route   POST /api/quotes
// @desc    Submit a new quote request
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, projectType, budget, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !projectType || !budget) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields.' 
      });
    }

    // Save entry to MongoDB
    const newQuote = await Quote.create({ 
      name, 
      email, 
      phone, 
      projectType, 
      budget, 
      message 
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted successfully.',
      data: newQuote
    });
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again.' 
    });
  }
});

// @route   GET /api/quotes
// @desc    Get all submitted quotes (For Demo Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: quotes.length, 
      data: quotes 
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch quotes.' 
    });
  }
});

// @route   DELETE /api/quotes/:id
// @desc    Delete a quote by ID (For Demo Admin Dashboard)
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quote not found.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Enquiry deleted successfully.' 
    });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete quote.' 
    });
  }
});

module.exports = router;