const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors()); // Using CORS

// Create connection to the database
const db = mysql.createConnection({
  host: '10.12.1.72',
  user: 'shadmin',
  password: 'P@$$w0rd',
  database: 'shphp_api'
});

// Connect to the database
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Example route to fetch data
app.get('/api/data', (req, res) => {
  let sql = 'SELECT * FROM member';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/api/data`);
});
