const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/authMiddleware")
// const authMiddleware = require("../middleware/authMiddleware");
// const { getUserData } = require('../controllers/userController');


router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get('/me', auth, async (req, res) => {
	try {
	  const user = await User.findById(req.user._id)
							.select('-password'); // Populate the subscription details
	  if (!user) {
		return res.status(404).send({ message: 'User not found' });
	  }
	  res.send(user);
	} catch (error) {
	  console.error('Error in /me route:', error);
	  res.status(500).send({ message: 'Internal server error' });
	}
  });


module.exports = router;
