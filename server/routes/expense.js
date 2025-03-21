const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const {User} = require("../models/user");
const Policy = require("../models/policy");

// Create a new expense (POST request)
router.post('/submit', auth, async (req, res) => {
  const { amount, date, category_id, vendor, notes, status } = req.body;
  
  // Validate incoming data
  if (!amount || !date || !category_id || !vendor) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check policy rules
    const policy = await Policy.findOne({ category: category_id });
    
    if (policy && amount > policy.limit) {
      // Expense violates policy
      const newExpense = new Expense({
        user_id: req.user._id,
        amount,
        date,
        category_id,
        vendor,
        notes,
        status: 'rejected',
      });
      await newExpense.save();

      // Send rejection email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'aryanpatel15903@gmail.com',
          pass: 'ttpvmhhioydlkigx',
        },
      });

      const mailOptions = {
        from: 'aryanpatel15903@gmail.com',
        to: user.email,
        subject: 'Expense Rejected Due to Policy Violation',
        text: `Your expense for ${category_id} has been rejected because it exceeds the limit of ${policy.limit}.`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(201).json({ message: 'Expense rejected due to policy violation', expense: newExpense });
    }

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

    // // Save the expense to the database
    const savedExpense = await newExpense.save();

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use any email provider, here it's Gmail
      auth: {
        user: 'aryanpatel15903@gmail.com', // Your email
        pass: 'ttpvmhhioydlkigx', // Your email password or app-specific password
      },
    });

    // Compose email
    const mailOptions = {
      from: 'aryanpatel15903@gmail.com', // Sender email address
      to: user.email, // User's email, assuming it's in the authenticated token
      subject: 'Expense Submitted Successfully',
      text: `Hello, Your expense has been submitted successfully. Details:
             - Amount: ${amount}
             - Vendor: ${vendor}
             - Date: ${date}
             - Status: ${status || 'pending'}
        Thank you!`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  
    // Respond to the client
    res.status(201).json({ message: 'Expense submitted and email sent successfully', data: savedExpense });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting expense', error });
    console.log("User: ",req.user);
    console.log("Error: ", error);
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

// GET endpoint to fetch approved expenses count for the logged-in user
router.get('/approvedcount', auth, async (req, res) => {
  try {
    const approvedCount = await Expense.countDocuments({ 
      user_id: req.user._id, 
      status: 'approved' 
    });
    res.status(200).json({ count: approvedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved expenses count' });
  }
});

// GET endpoint to fetch rejected expenses count for the logged-in user
router.get('/rejectedcount', auth, async (req, res) => {
  try {
    const rejectedCount = await Expense.countDocuments({ 
      user_id: req.user._id, 
      status: 'rejected' 
    });
    res.status(200).json({ count: rejectedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rejected expenses count' });
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
