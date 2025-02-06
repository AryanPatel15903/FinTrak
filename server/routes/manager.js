// routes/manager.js
const router = require("express").Router();
const { User } = require("../models/user");
const Expense = require("../models/Expense");
const auth = require("../middleware/authMiddleware");

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
      console.log(req.body);
      
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
  
      if (!expense)
        return res.status(404).json({ message: "Expense not found" });
  
      res.status(200).json({ message: "Expense status updated", expense });
    } catch (error) {
      res.status(500).json({ message: "Error updating expense status" });
    }
  });
  


module.exports = router;
