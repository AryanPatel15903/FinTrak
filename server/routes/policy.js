const express = require("express");
const router = express.Router();
const Policy = require("../models/policy");
const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// Add a new policy
router.post("/add", auth, adminAuth, async (req, res) => {
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
router.put("/update/:id", auth, adminAuth, async (req, res) => {
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
router.delete("/delete/:id", auth, adminAuth, async (req, res) => {
  try {
    await Policy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting policy", error });
  }
});

router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const policies = await Policy.find();
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching policies", error });
  }
});

module.exports = router;
