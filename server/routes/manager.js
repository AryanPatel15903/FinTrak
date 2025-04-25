// routes/manager.js
const router = require("express").Router();
const { User } = require("../models/user");
const Expense = require("../models/Expense");
const auth = require("../middleware/authMiddleware");
const nodemailer = require('nodemailer');
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Store in .env file
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Store in .env file
});

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

// Fetch employee details
router.get("/employee-details/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("firstName lastName email");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
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

// Create Razorpay order
router.post("/create-razorpay-order/:expenseId", auth, managerAuth, async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Verify expense exists
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ensure expense is approved and not already paid
    if (expense.status !== "approved") {
      return res.status(400).json({ message: "Expense must be approved to process payment" });
    }
    if (expense.payment) {
      return res.status(400).json({ message: "Expense is already paid" });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise (Razorpay expects amount in smallest currency unit)
      currency: "INR",
      receipt: `expense_${expense._id}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating payment order" });
  }
});

// Verify Razorpay payment
router.post("/verify-payment/:expenseId", auth, managerAuth, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Validate input
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Verify expense exists
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Generate signature for verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update expense payment status
    expense.payment = true;
    await expense.save();

    // // Send email notification to employee
    // const employee = await User.findById(expense.user_id);
    // if (!employee) {
    //   return res.status(404).json({ message: "Employee not found" });
    // }

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER, // Store in .env
    //     pass: process.env.EMAIL_PASS, // Store in .env
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: employee.email,
    //   subject: "Expense Payment Processed",
    //   text: `Hello ${employee.firstName}, 
    //          The payment for your expense has been processed successfully:
    //          - Amount: ${expense.amount}
    //          - Vendor: ${expense.vendor}
    //          - Submission Date: ${expense.submission_date}
    //          - Payment ID: ${razorpay_payment_id}
             
    //          Thank you!`,
    // };

    // await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Payment verified and expense updated" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
});

module.exports = router;
