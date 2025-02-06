// routes/admin.js
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/authMiddleware");

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

module.exports = router;
