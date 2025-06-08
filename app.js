const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");

// Routers
const dishesRoutes = require("./routes/dishesRoutes");
const userRoutes = require("./routes/userRoutes");
const isAuthenticated = require("./middleware/auth");

const PORT = 3001;


// Session configuration
app.use(
  session({
    secret: "your_secret_key", 
    resave: false,
    saveUninitialized: true,
  })
);  

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/dishes", isAuthenticated, dishesRoutes);
app.use("/api", userRoutes); // includes /api/login and /api/users

//  protected HTML views
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "login.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "register.html"))
);
app.get("/dishes", isAuthenticated,(req, res) =>
  res.sendFile(path.join(__dirname, "views", "dishes.html"))
);
app.get("/home", isAuthenticated,(req, res) =>
  res.sendFile(path.join(__dirname, "views", "home.html"))
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
