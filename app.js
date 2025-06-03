const express = require("express");
const path = require("path");
const dishesRouter = require("./routes/dishesRouter");
const app = express();

// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/dishes", dishesRouter);

// Serve HTML pages from /views
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
