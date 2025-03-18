// routes/manager.js
const router = require("express").Router();
const { User } = require("../models/user");
const Expense = require("../models/Expense");
const auth = require("../middleware/authMiddleware");
const nodemailer = require('nodemailer');

// Middleware to ensure the user is a manager (or admin if desired)
const managerAuth = (req, res, next) => {
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Managers only." });
  }
  next();
};

// Route to get a list of employees
router.get("/employees", auth, managerAuth, async (req, res) => {
  try {
    // Find all users with role "employee"
    const employees = await User.find({ role: "employee" }).select("-password");
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// Get expenses for a specific employee
router.get("/employee/:employeeId", auth, managerAuth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user_id: req.params.employeeId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee expenses" });
  }
});

// routes/expenses.js (continue in the same file)
router.put("/updateStatus/:expenseId", auth, managerAuth, async (req, res) => {
  try {
    // console.log(req.body);

    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update the expense status
    const expense = await Expense.findByIdAndUpdate(
      req.params.expenseId,
      { status },
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Fetch the employee's details (user) from the database using the user_id stored in the expense
    const employee = await User.findById(expense.user_id);

    // console.log(employee);
    

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service provider (e.g., Gmail, Yahoo, etc.)
      auth: {
        user: "aryanpatel15903@gmail.com", // Your email
        pass: "ttpvmhhioydlkigx", // Your email password or app-specific password
      },
    });

    // console.log("mail set");
    

    // Compose the email
    const mailOptions = {
      from: "aryanpatel15903@gmail.com", // Sender address
      to: employee.email, // Employee's email retrieved from the User model
      subject: "Expense Status Update",
      text: `Hello ${employee.firstName}, Your expense with the following details has been ${status} by the manager:
             - Amount: ${expense.amount}
             - Vendor: ${expense.vendor}
             - Submission Date: ${expense.date}
             - Current Status: ${status}
             
        Thank you!`,
    };

    // console.log("all ready");
    

    // Send email
    await transporter.sendMail(mailOptions);

    // console.log("mail sent");
    

    // Respond to the client
    res
      .status(200)
      .json({
        message: "Expense status updated and email notification sent",
        expense,
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating expense status" });
  }
});

module.exports = router;
