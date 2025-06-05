const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const singleton = require('../utils/dbSingleton');
const db = singleton.getConnection();

router.use(express.json());

// Create user with hashed password
router.post('/users', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).send('Name and password are required');
  }

  const checkUserQuery = 'SELECT * FROM users WHERE name = ?';
  db.query(checkUserQuery, [name], (err, results) => {
    if (err) return res.status(500).send('Error checking user existence');
    if (results.length > 0) return res.status(400).send('User already exists');

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).send('Error hashing password');

      const insertQuery = 'INSERT INTO users (name, password) VALUES (?, ?)';
      db.query(insertQuery, [name, hash], (error, results) => {
        if (error) return res.status(500).send('Error creating user');
        res.json({ id: results.insertId, name });
      });
    });
  });
});

// ✅ Read all users
router.get('/', (req, res) => {
  db.query('SELECT id, name FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(results);
  });
});

// ✅ Read one user by ID
router.get('/:id', (req, res) => {
  db.query('SELECT id, name FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

// ✅ Login (name + password)
router.post('/login', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).send('Name and password are required');
  }

  db.query('SELECT * FROM users WHERE name = ?', [name], (err, results) => {
    if (err) return res.status(500).send('Error fetching user');
    if (results.length === 0) return res.status(404).send('User not found');

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Error comparing passwords');
      if (!isMatch) return res.status(401).send('Invalid password');

      res.json({ message: 'Login successful', user: { id: user.id, name: user.name } });
    });
  });
});

module.exports = router;
