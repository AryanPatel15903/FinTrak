const mongoose = require('mongoose');

// Define the Expense schema
const expenseSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // User ID
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category_id: { type: String, required: true },
  vendor: { type: String, required: true },
  notes: { type: String },
  status: { type: String, default: 'pending' }, // Status of the expense (e.g., 'pending', 'approved', 'rejected')
  submission_date: { type: Date, default: Date.now }, // Submission date, default is current date/time
  payment: {type: Boolean, default: false},
});

// Create the model
const Expense = mongoose.model('ExpenseData', expenseSchema);

module.exports = Expense;
