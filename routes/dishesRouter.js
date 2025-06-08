const express = require("express");
const dbSingleton = require("../utils/dbSingleton");
const router = express.Router();

const db = dbSingleton.getConnection();

// Get all dishes
router.get("/", (req, res) => {
  const query = "SELECT * FROM dishes";
  db.query(query, (error, results) => {
    if (error) return res.status(500).send("Error fetching dishes");
    res.status(200).send(results);
  });
});

// Add new dish
router.post("/", (req, res) => {
  const { dish_id, dish_name, made_of, price } = req.body;

  if (!dish_id || !dish_name || !made_of || !price) {
    return res.status(400).send("Missing required fields");
  }

  const checkQuery = "SELECT * FROM dishes WHERE dish_id = ?";
  db.query(checkQuery, [dish_id], (error, results) => {
    if (error) return res.status(500).send("Error checking dish");
    if (results.length > 0) return res.status(400).send("Dish already exists");

    const insertQuery = "INSERT INTO dishes (dish_id, dish_name, made_of, price) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [dish_id, dish_name, made_of, price], (error) => {
      if (error) return res.status(500).send("Error adding a dish");
      res.status(201).send("Dish added successfully");
    });
  });
});

// Update dish
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { dish_name, made_of, price } = req.body;

  if (!dish_name || !made_of || !price) {
    return res.status(400).send("Missing required fields");
  }

  const checkQuery = "SELECT * FROM dishes WHERE dish_id = ?";
  db.query(checkQuery, [id], (error, results) => {
    if (error) return res.status(500).send("Error checking dish");
    if (results.length === 0) return res.status(404).send("Dish not found");

    const updateQuery = "UPDATE dishes SET dish_name = ?, made_of = ?, price = ? WHERE dish_id = ?";
    db.query(updateQuery, [dish_name, made_of, price, id], (error, results) => {
      if (error) return res.status(500).send("Error updating dish");
      res.status(200).send("Dish updated successfully");
    });
  });
});

// Delete dish
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM dishes WHERE dish_id = ?";
  db.query(query, [id], (error, results) => {
    if (error) return res.status(500).send("Error deleting dish");
    if (results.affectedRows === 0) return res.status(404).send("Dish not found");
    res.status(200).send("Dish deleted successfully");
  });
});

module.exports = router;
