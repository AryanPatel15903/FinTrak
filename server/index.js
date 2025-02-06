require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const expenseRoute = require('./routes/expense');
const adminRoutes = require("./routes/admin");
const managerRoutes = require("./routes/manager");
// const User = require("./models/user")

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/expenses', expenseRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
