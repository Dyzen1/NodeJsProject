const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const singleton = require('../utils/dbSingleton');
const db = singleton.getConnection();

router.use(express.json());

// Create user with hashed password
router.post('/users', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send('Username, email, and password are required');
  }

  const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkUserQuery, [username, email], (err, results) => {
    if (err) return res.status(500).send('Error checking user existence');
    if (results.length > 0) return res.status(400).send('User already exists');

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).send('Error hashing password');

      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, email, hash], (error, results) => {
        if (error) return res.status(500).send('Error creating user');
        res.json({ id: results.insertId, username });
      });
    });
  });
});

// Read all users
router.get('/', (req, res) => {
  db.query('SELECT id, username, email FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(results);
  });
});

// Read one user by ID
router.get('/:id', (req, res) => {
  db.query('SELECT id, username, email FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

// Login (using username)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).send('Error fetching user');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Error comparing passwords');
      if (!isMatch) return res.status(401).send('Invalid password');

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };

      res.json({ message: 'Login successful', user: req.session.user });
    });
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.json({ message: 'Logout successful' });
  });
});

module.exports = router;
