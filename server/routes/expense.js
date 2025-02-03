const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware');

// Create a new expense (POST request)
router.post('/submit', auth, async (req, res) => {
  const { amount, date, category_id, vendor, notes, status } = req.body;
  
  // Validate incoming data
  if (!amount || !date || !category_id || !vendor) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Create a new expense with submission_date automatically set and status defaulting to 'pending' if not provided
    const newExpense = new Expense({
      user_id: req.user._id, // Get user id from the authenticated token
      amount,
      date,
      category_id,
      vendor,
      notes,
      status: status || 'pending', // Set status, default to 'pending' if not provided
    });

    // Save the expense to the database
    const savedExpense = await newExpense.save();
    
    res.status(201).json({ message: 'Expense submitted successfully', data: savedExpense });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting expense', error });
  }
});

// Get all expenses for the logged-in user
router.get('/myexpenses', auth, async (req, res) => {
  try {
    // Find all expenses where the user_id matches the logged-in user
    const expenses = await Expense.find({ user_id: req.user._id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

// Get count of pending expenses for the logged-in user
router.get('/pendingcount', auth, async (req, res) => {
  try {
    const pendingCount = await Expense.countDocuments({ user_id: req.user._id, status: 'pending' });
    res.status(200).json({ count: pendingCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending expenses count' });
  }
});

// GET API to fetch the last 5 recent expenses for the logged-in user
router.get('/recent', auth, async (req, res) => {
  try {
    // Find the last 5 expenses for the logged-in user sorted by submission_date in descending order
    const recentExpenses = await Expense.find({ user_id: req.user._id })
      .sort({ submission_date: -1 }) // Sort by submission_date (newest first)
      .limit(5); // Limit the result to the last 5 expenses

    // Return the expenses as JSON
    res.status(200).json(recentExpenses);
  } catch (error) {
    // Handle any errors and send a 500 status code
    res.status(500).json({ message: 'Error fetching recent expenses' });
  }
});




module.exports = router;
