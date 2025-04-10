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

    // Check if the user has enough budget for the category
    const remainingBudget = user.budget.get(category_id) || 0;
    if (remainingBudget < amount) {
      return res.status(400).json({
        message: `Expense exceeds the remaining budget for ${category_id}. Remaining: ${remainingBudget}`,
      });
    }

    // Deduct the expense amount from the user's budget
    user.budget.set(category_id, remainingBudget - amount);
    await user.save();

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

// Get expenses by category for the logged-in user
router.get('/bycategory', auth, async (req, res) => {
  try {
    // Aggregate expenses by category
    const expensesByCategory = await Expense.aggregate([
      // Match expenses for the current user and approved status
      { $match: { 
        user_id: req.user._id.toString(),
        status: 'approved'
      }},
      // Group by category and sum the amounts
      { $group: {
        _id: '$category_id',
        value: { $sum: '$amount' }
      }},
      // Reshape for chart consumption
      { $project: {
        _id: 0,
        name: '$_id',
        value: 1
      }}
    ]);

    res.status(200).json(expensesByCategory);
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    res.status(500).json({ message: 'Error fetching expenses by category' });
  }
});

// Get expense trends (monthly) for the logged-in user
router.get('/trend', auth, async (req, res) => {
  try {
    // Get current date
    const currentDate = new Date();
    
    // Calculate date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start from the 1st day of the month
    
    // Aggregate expenses by month
    const expensesTrend = await Expense.aggregate([
      // Match expenses for current user that are within the last 6 months
      { $match: { 
        user_id: req.user._id.toString(),
        date: { $gte: sixMonthsAgo },
        status: { $in: ['approved', 'pending'] }
      }},
      // Add month field for grouping
      { $addFields: {
        month: { $month: '$date' },
        year: { $year: '$date' }
      }},
      // Group by year and month
      { $group: {
        _id: { year: '$year', month: '$month' },
        amount: { $sum: '$amount' }
      }},
      // Sort by year and month
      { $sort: { '_id.year': 1, '_id.month': 1 }},
      // Project to format for chart
      { $project: {
        _id: 0,
        name: {
          $let: {
            vars: {
              monthsInString: [
                '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ]
            },
            in: {
              $concat: [
                { $arrayElemAt: ['$monthsInString', '$_id.month'] },
                ' ',
                { $toString: '$_id.year' }
              ]
            }
          }
        },
        amount: 1
      }}
    ]);

    // If no data for some months, fill in with zeros
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    
    // Get current month and fill in data for the last 6 months
    const currentMonth = currentDate.getMonth(); // 0-11
    
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - i + 12) % 12; // Ensure positive index
      const targetMonth = months[monthIndex];
      const targetYear = currentDate.getFullYear() - (currentMonth < monthIndex ? 1 : 0);
      
      const monthKey = `${targetMonth} ${targetYear}`;
      const existingData = expensesTrend.find(item => item.name === monthKey);
      
      if (existingData) {
        result.unshift(existingData);
      } else {
        result.unshift({
          name: monthKey,
          amount: 0
        });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching expense trends:', error);
    res.status(500).json({ message: 'Error fetching expense trends' });
  }
});

// Get top vendors by expense amount for the logged-in user
router.get('/topvendors', auth, async (req, res) => {
  try {
    // Aggregate to find top 5 vendors by total expenses
    const topVendors = await Expense.aggregate([
      // Match expenses for the current user
      { $match: { user_id: req.user._id.toString() }},
      // Group by vendor and calculate total amount
      { $group: {
        _id: '$vendor',
        value: { $sum: '$amount' }
      }},
      // Sort by total amount (descending)
      { $sort: { value: -1 }},
      // Limit to top 5
      { $limit: 5 },
      // Reshape for chart consumption
      { $project: {
        _id: 0,
        name: '$_id',
        value: 1
      }}
    ]);

    res.status(200).json(topVendors);
  } catch (error) {
    console.error('Error fetching top vendors:', error);
    res.status(500).json({ message: 'Error fetching top vendors' });
  }
});

// Get expenses by status with amounts (for pie chart)
router.get('/bystatus', auth, async (req, res) => {
  try {
    // Aggregate expenses by status
    const expensesByStatus = await Expense.aggregate([
      // Match expenses for the current user
      { $match: { user_id: req.user._id.toString() }},
      // Group by status and sum the amounts
      { $group: {
        _id: '$status',
        value: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      // Reshape for chart consumption
      { $project: {
        _id: 0,
        name: { 
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'pending'] }, then: 'Pending' },
              { case: { $eq: ['$_id', 'approved'] }, then: 'Approved' },
              { case: { $eq: ['$_id', 'rejected'] }, then: 'Rejected' }
            ],
            default: '$_id'
          }
        },
        value: 1,
        count: 1,
        color: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'pending'] }, then: '#FFBB28' },
              { case: { $eq: ['$_id', 'approved'] }, then: '#00C49F' },
              { case: { $eq: ['$_id', 'rejected'] }, then: '#FF8042' }
            ],
            default: '#8884d8'
          }
        }
      }}
    ]);

    res.status(200).json(expensesByStatus);
  } catch (error) {
    console.error('Error fetching expenses by status:', error);
    res.status(500).json({ message: 'Error fetching expenses by status' });
  }
});

// Get monthly spending compared to budget
router.get('/budgetcomparison', auth, async (req, res) => {
  try {
    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // MongoDB months are 1-12
    const currentYear = currentDate.getFullYear();

    // Start and end of current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    // Get expenses for current month grouped by category
    const monthlyExpensesByCategory = await Expense.aggregate([
      // Match expenses for current user in current month with approved or pending status
      { $match: {
        user_id: req.user._id.toString(),
        date: { $gte: startOfMonth, $lte: endOfMonth },
        status: { $in: ['approved', 'pending'] }
      }},
      // Group by category
      { $group: {
        _id: '$category_id',
        spent: { $sum: '$amount' }
      }},
      // Project to format for chart
      { $project: {
        _id: 0,
        category: '$_id',
        spent: 1
      }}
    ]);

    // Fetch user to get budget information
    const { User } = require('../models/user');
    const user = await User.findById(req.user._id);

    // Transform budget data for comparison
    const budgetComparison = [];
    
    if (user && user.budget) {
      // Convert Map to Object if it's a Map
      const budgetObj = user.budget instanceof Map 
        ? Object.fromEntries(user.budget) 
        : user.budget;
      
      // For each budget category
      Object.entries(budgetObj).forEach(([category, budget]) => {
        const expenseData = monthlyExpensesByCategory.find(e => e.category === category);
        const spent = expenseData ? expenseData.spent : 0;
        
        budgetComparison.push({
          name: category,
          budget: budget,
          spent: spent,
          remaining: budget - spent
        });
      });
    }

    res.status(200).json(budgetComparison);
  } catch (error) {
    console.error('Error fetching budget comparison:', error);
    res.status(500).json({ message: 'Error fetching budget comparison' });
  }
});


module.exports = router;
