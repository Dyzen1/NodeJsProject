const express = require('express');
const path = require('path');
const userRoutes = require('./routes/users');
const db = require('./utils/dbSingleton'); // 👈 Import the singleton

const app = express();
// db.getConnection(); // 👈 Initialize MySQL connection once

// Serve static assets (CSS, JS)
app.use(express.static(path.join(__dirname, 'styles')));






app.use('/api/users', userRoutes);




// Serve HTML pages from /views
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'views', 'products.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'views', 'home.html')));


const PORT = 3001;  
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
