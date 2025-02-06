// models/user.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  password:  { type: String, required: true },
  role: {
    type: String,
    enum: ["employee", "manager", "admin"],
    default: "employee"  // By default, new users are employees
  }
});

userSchema.methods.generateAuthToken = function () {
  // Include the role in the token payload so later you can check for permissions.
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
  );
  return token;
};

const User = mongoose.model("users", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    // Optionally, you could allow role in validation if admin creates managers.
    role: Joi.string().valid("employee", "manager", "admin")
  });
  return schema.validate(data);
};

module.exports = { User, validate };
