const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));

const usersDB = new sqlite3.Database('./users.db');
const catsDB = new sqlite3.Database('./cats.db');

// Creating users
usersDB.run(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE
  )
`,
  (err) => {
    if (err) {
      console.error('Error creating users table: ', err.message);
    } else {
      console.log('Users table created or already exists');
    }
  },
);

// Creating cats
catsDB.run(
  `
  CREATE TABLE IF NOT EXISTS cats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nimi TEXT,
    laji TEXT,
    sijainti TEXT,
    omistaja TEXT,
    lelu TEXT,
    kuva TEXT
  )
`,
  (err) => {
    if (err) {
      console.error('Error creating cats table: ', err.message);
    } else {
      console.log('Cats table created or already exists');
    }
  },
);

app.get('/api/data', (req, res) => {
  res.json({ message: 'hello, express!' });
});

app.post('/api/register', async (req, res) => {
  const { username, password, email, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  usersDB.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
    if (err) return res.status(400).json({ error: 'Username already taken or invalid input' });
  });

  res.json({ message: 'Registration successful' });
  return;
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  usersDB.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid username' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(402).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  });
});

app.post('/api/cats', (req, res) => {
  const { nimi, laji, sijainti, omistaja, lelu, kuva } = req.body;

  catsDB.run(
    'INSERT INTO cats (nimi, laji, sijainti, omistaja, lelu, kuva) VALUES (?, ?, ?, ?, ?, ?)',
    [nimi, laji, sijainti, omistaja, lelu, kuva],
    (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: 'Cat added successfully' });
    },
  );
});

app.get('/api/cats', (req, res) => {
  catsDB.all('SELECT * FROM cats', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/cats/:id', (req, res) => {
  const { id } = req.params;
  const { nimi, laji, sijainti, omistaja, lelu, kuva } = req.body;

  catsDB.run(
    'UPDATE cats SET nimi = ?, laji = ?, sijainti = ?, omistaja = ?, lelu = ?, kuva = ? WHERE id = ?',
    [nimi, laji, sijainti, omistaja, lelu, kuva, id],
    (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: 'Cat updated successfully' });
    },
  );
});

app.delete('/api/cats/:id', (req, res) => {
  const { id } = req.params;

  catsDB.run('DELETE FROM cats WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Cat deleted successfully' });
  });
});



app.listen(port, () => {
  console.log(`server is runnig at http://localhost:${port}`);
});
