// routes/admin.js
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/authMiddleware");
const Policy = require('../models/policy');

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
router.post('/policies/add', auth, adminAuth, async (req, res) => {
  const { category, limit } = req.body;
  try {
    const newPolicy = new Policy({ category, limit });
    await newPolicy.save();
    res.status(201).json({ message: 'Policy added successfully', policy: newPolicy });
  } catch (error) {
    res.status(500).json({ message: 'Error adding policy', error });
  }
});

// Update an existing policy
router.put('/policies/update/:id', auth, adminAuth, async (req, res) => {
  const { category, limit } = req.body;
  try {
    const updatedPolicy = await Policy.findByIdAndUpdate(req.params.id, { category, limit }, { new: true });
    res.status(200).json({ message: 'Policy updated successfully', policy: updatedPolicy });
  } catch (error) {
    res.status(500).json({ message: 'Error updating policy', error });
  }
});

// Delete a policy
router.delete('/policies/delete/:id', auth, adminAuth, async (req, res) => {
  try {
    await Policy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting policy', error });
  }
});

// Fetch all policies
router.get('/policies', auth, adminAuth, async (req, res) => {
  try {
    const policies = await Policy.find();
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching policies', error });
  }
});

module.exports = router;
