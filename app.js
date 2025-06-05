const express = require("express");
const path = require("path");
const app = express();

// Routers
const dishesRouter = require("./routes/dishesRouter");
const userRoutes = require("./routes/userRoutes");

const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/dishes", dishesRouter);
app.use("/api", userRoutes); // includes /api/login and /api/users

// HTML views
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "login.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "register.html"))
);
app.get("/dishes", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "dishes.html"))
);
app.get("/home", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "home.html"))
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
