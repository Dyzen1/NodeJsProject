const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../utils/dbSingleton').getConnection();

router.use(express.json());

router.post('/', (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) return res.status(400).send('Missing fields');

  db.query('SELECT * FROM users WHERE name = ?', [name], (err, results) => {
    if (err) return res.status(500).send('DB error');
    if (results.length > 0) return res.status(400).send('User exists');

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).send('Hash error');

      db.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, hash], (err, result) => {
        if (err) return res.status(500).send('Insert error');
        res.status(201).json({ id: result.insertId, name });
      });
    });
  });
});

module.exports = router;
