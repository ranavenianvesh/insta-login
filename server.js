const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const PORT = 3000;

// 🔧 MySQL Connection for local setup
const db = mysql.createConnection({
  host: 'localhost',         // local MySQL server
  user: 'root',              // your MySQL username (default is 'root')
  password: 'anvesh@@1434',              // your password (often empty for localhost)
  database: 'instadbb',        // the database you created
});

db.connect((err) => {
  if (err) {
    console.error(' MySQL connection failed: ' + err.message);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

// Handle login attempts
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) throw err;

    const status = results.length > 0 ? 'valid' : 'invalid';

    const logAttempt = 'INSERT INTO login_attempts (username, password, status) VALUES (?, ?, ?)';
    db.query(logAttempt, [username, password, status], (err2) => {
      if (err2) throw err2;

      if (status === 'valid') {
        res.send('<h2> Login Successful</h2>');
      } else {
        res.send('<h2> Invalid Credentials</h2>');
      }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
