// routes/admin.js
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/authMiddleware");
const Policy = require("../models/policy");
const Expense = require("../models/Expense");

// Middleware to check for admin privileges
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

router.get("/managers", auth, async (req, res) => {
  try {
    // Check if the logged-in user is either an admin or a manager
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied." });
    }

    // Fetch all users with role "manager" (excluding password)
    const managers = await User.find({ role: "manager" }).select("-password");
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching managers" });
  }
});

// Route for admin to add a manager
router.post("/addManager", auth, adminAuth, async (req, res) => {
  try {
    // In this route, force the role to "manager"
    const managerData = { ...req.body, role: "manager" };
    const { error } = validate(managerData);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Check if the email already exists
    let user = await User.findOne({ email: managerData.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(managerData.password, salt);

    user = new User({ ...managerData, password: hashPassword });
    await user.save();
    res.status(201).send({ message: "Manager added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Add a new policy
router.post("/policies/add", auth, adminAuth, async (req, res) => {
  const { category, limit } = req.body;
  try {
    const newPolicy = new Policy({ category, limit });
    await newPolicy.save();
    res
      .status(201)
      .json({ message: "Policy added successfully", policy: newPolicy });
  } catch (error) {
    res.status(500).json({ message: "Error adding policy", error });
  }
});

// Update an existing policy
router.put("/policies/update/:id", auth, adminAuth, async (req, res) => {
  const { category, limit } = req.body;
  try {
    const updatedPolicy = await Policy.findByIdAndUpdate(
      req.params.id,
      { category, limit },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Policy updated successfully", policy: updatedPolicy });
  } catch (error) {
    res.status(500).json({ message: "Error updating policy", error });
  }
});

// Delete a policy
router.delete("/policies/delete/:id", auth, adminAuth, async (req, res) => {
  try {
    await Policy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting policy", error });
  }
});

// Fetch all policies
router.get("/policies", auth, adminAuth, async (req, res) => {
  try {
    const policies = await Policy.find();
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching policies", error });
  }
});

// Fetch all users (accessible only by admin)
router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: "employee" }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Assign budget to a user
router.put("/assign-budget/:userId", auth, adminAuth, async (req, res) => {
  const { totalBudget } = req.body; // Example: { travel: 5000, meals: 2000, office: 3000 }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { totalBudget, remainingBudget: totalBudget },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Budget assigned successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error assigning budget", error });
  }
});

// Stats Overview
router.get("/stats-overview", auth, adminAuth, async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const unassignedEmployees = await User.countDocuments({
      role: "employee",
      totalBudget: 0,
    });
    const activePolicies = await Policy.countDocuments();
    const compliantEmployees = await User.countDocuments({
      role: "employee",
      totalBudget: { $gt: 0 },
    });
    const compliancePercentage =
      totalEmployees > 0 ? (compliantEmployees / totalEmployees) * 100 : 0;

    res.status(200).json({
      totalEmployees,
      unassignedEmployees,
      activePolicies,
      policyCompliance: compliancePercentage.toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats overview", error });
  }
});

// Employee Assignment Trend
router.get("/employee-assignment-trend", auth, adminAuth, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6); // Last 6 months
    const employees = await User.aggregate([
      {
        $match: {
          role: "employee",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            assigned: { $cond: [{ $gt: ["$totalBudget", 0] }, true, false] },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { month: "$_id.month", year: "$_id.year" },
          data: {
            $push: {
              assigned: "$_id.assigned",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          name: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  { $subtract: ["$_id.month", 1] },
                ],
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          assigned: {
            $sum: {
              $map: {
                input: "$data",
                as: "item",
                in: {
                  $cond: [
                    { $eq: ["$$item.assigned", true] },
                    "$$item.count",
                    0,
                  ],
                },
              },
            },
          },
          unassigned: {
            $sum: {
              $map: {
                input: "$data",
                as: "item",
                in: {
                  $cond: [
                    { $eq: ["$$item.assigned", false] },
                    "$$item.count",
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee assignment trend", error });
  }
});

// Budget Utilization (replacing Department Distribution)
router.get("/budget-utilization", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({
      role: "employee",
      totalBudget: { $gt: 0 },
    });
    const utilization = users.map((user) => ({
      name: `${user.firstName} ${user.lastName}`,
      utilized:
        ((user.totalBudget - user.remainingBudget) / user.totalBudget) * 100,
    }));
    res.status(200).json(utilization.slice(0, 5)); // Limit to top 5 for chart
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching budget utilization", error });
  }
});

// Policy Compliance
router.get("/policy-compliance", auth, adminAuth, async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const compliantEmployees = await User.countDocuments({
      role: "employee",
      totalBudget: { $gt: 0 },
    });
    const complianceData = [
      {
        name: "Compliant",
        value:
          totalEmployees > 0 ? (compliantEmployees / totalEmployees) * 100 : 0,
        color: "#4ade80",
      },
      {
        name: "Non-compliant",
        value:
          totalEmployees > 0
            ? ((totalEmployees - compliantEmployees) / totalEmployees) * 100
            : 0,
        color: "#f87171",
      },
    ];
    res.status(200).json(complianceData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching policy compliance", error });
  }
});

// Policy Categories
router.get("/policy-categories", auth, adminAuth, async (req, res) => {
  try {
    const categories = await Policy.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          color: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "Security"] }, then: "#60a5fa" },
                { case: { $eq: ["$_id", "HR"] }, then: "#a78bfa" },
                { case: { $eq: ["$_id", "IT"] }, then: "#34d399" },
              ],
              default: "#fbbf24",
            },
          },
          _id: 0,
        },
      },
    ]);
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching policy categories", error });
  }
});

// User Activity
router.get("/user-activity", auth, adminAuth, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // Last 5 days
    const activities = await Expense.aggregate([
      {
        $match: {
          submission_date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$submission_date" },
          },
          submissions: { $sum: 1 },
          approvals: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          name: {
            $arrayElemAt: [
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              { $subtract: ["$_id.day", 1] },
            ],
          },
          submissions: 1,
          approvals: 1,
          _id: 0,
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user activity", error });
  }
});

// Recent Activities
router.get("/recent-activities", auth, adminAuth, async (req, res) => {
  try {
    // console.log("Fetching recent activities...");
    const expenses = await Expense.find()
      .sort({ submission_date: -1 }) // Use submission_date for sorting
      .limit(6);

    // console.log("Expenses found:", expenses.length);
    if (!expenses || expenses.length === 0) {
      // console.log("No expenses found, returning empty array");
      return res.json([]);
    }

    // Manually fetch user details for each expense
    const activities = await Promise.all(
      expenses.map(async (expense) => {
        // console.log(`Processing expense ${expense._id}, user_id: ${expense.user_id}`);
        // Fetch user by user_id
        const user = await User.findById(expense.user_id).select(
          "firstName lastName email"
        );
        if (!user) {
          console.warn(`User not found for user_id: ${expense.user_id}`);
          return {
            user: {
              firstName: "Unknown",
              lastName: "User",
              email: "unknown@example.com",
              initials: "UU",
            },
            action:
              expense.status === "pending"
                ? "Submitted"
                : expense.status === "approved"
                ? "Approved"
                : "Rejected",
            target: `Expense: ${expense.notes || "N/A"}`, // Use notes instead of description
            time: expense.submission_date
              ? expense.submission_date.toISOString()
              : new Date().toISOString(),
            status:
              expense.status.charAt(0).toUpperCase() + expense.status.slice(1),
          };
        }

        return {
          user: {
            firstName: user.firstName || "Unknown",
            lastName: user.lastName || "User",
            email: user.email || "unknown@example.com",
            initials: `${user.firstName?.[0] || "U"}${
              user.lastName?.[0] || "U"
            }`,
          },
          amount: expense.amount || 0,
          category: expense.category_id || "N/A",
          time: expense.submission_date
            ? new Date(expense.submission_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
          status:
            expense.status.charAt(0).toUpperCase() + expense.status.slice(1),
        };
      })
    );

    // console.log("Activities generated:", activities.length);
    res.json(activities);
  } catch (err) {
    console.error("Error in recent-activities:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
