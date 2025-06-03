const express = require("express");
const dbSingleton = require("../utils/dbSingleton");
const router = express.Router();


// Middleware to establish database connection
router.use((req, res, next) => {
  try {
    const connection = dbSingleton.getConnection();
    req.dbConnection = connection;
    next();
  } catch (err) {
    res.status(500).send("Failed to connect to database");
  }
});


// Route for getting all dishes
router.get("/", (req, res) => {
  const query = "SELECT * FROM dishes";
  req.dbConnection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send("Error fetching dishes");
    }
    res.status(201).send(results);
  });
});


// Route for adding a new dish
router.post("/", (req, res) => {
  const { dish_id, dish_name, made_of, price } = req.body;

  if (!dish_id || !dish_name || !made_of || !price) {
    return res.status(400).send("Missing required fields");
  }

  // Check the existence of each dish
  const query = "SELECT * FROM dishes WHERE dish_id = ?";
  req.dbConnection.query(query, [dish_id], (error, results) => {
    if (error) {
      return res.status(500).send("Error checking dish");
    }
    if (results.length > 0) {
      return res.status(400).send("Dish already exists");
    }
  });
  // Insert the new dish
  const insertQuery =
    "INSERT INTO dishes (dish_id, dish_name, made_of, price) VALUES (?, ?, ?)";
  req.dbConnection.query(
    insertQuery,
    [dish_id, dish_name, made_of, price],
    (error, results) => {
      if (error) {
        return res.status(500).send("Error adding a dish");
      }
      res.status(201).send("Dish added successfully");
    }
  );
});


// Route for updating a specific dish
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { dish_name, made_of, price } = req.body;

  if (!id || !dish_name || !made_of || !price) {
    return res.status(400).send("Missing required fields");
  }

  // Check if dish exists
  const query = "SELECT * FROM dishes WHERE dish_id = ?";
  req.dbConnection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).send("Error checking dish");
    }
    if (results.length === 0) {
      return res.status(404).send("Dish not found");
    }

    const query =
      "UPDATE dishes SET dish_name = ?, made_of = ?, price = ? WHERE dish_id = ?";
    req.dbConnection.query(
      query,
      [id, dish_name, made_of, price],
      (error, results) => {
        if (error) {
          return res.status(500).send("Error updating dish");
        }
        if (results.affectedRows === 0) {
          return res.status(404).send("Dish not found");
        }
        res.status(201).send("Dish updated successfully");
      }
    );
  });
});


// Route for deleting a dish
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM dishes WHERE dish_id = ?";
  req.dbConnection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).send("Error deleting dish");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Dish not found");
    }
    res.status(201).send("Dish deleted successfully");
  });
});

module.exports = router;
