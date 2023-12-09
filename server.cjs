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
app.use('/assets', express.static('public/assets'));

const usersDB = new sqlite3.Database('./users.db');
const catsDB = new sqlite3.Database('./cats.db');

const mockData = [
  {
    id: 1,
    nimi: 'Miri',
    laji: 'Scottish long hair',
    city: 'Helsinki',
    omistaja: 'Mirva',
    lelu: 'pallo',
    kuva: '/assets/miri1.jpg',
    liked: true,
    available_from: '2023-12-09',
    available_until: '2024-12-10',
  },
  {
    id: 2,
    nimi: 'Musti',
    laji: 'Persian',
    city: 'Espoo',
    omistaja: 'Pekka',
    lelu: 'naru',
    kuva: '/assets/miri4.jpg',
    liked: false,
    available_from: '2023-12-24',
    available_until: '2024-12-09',
  },
  {
    id: 3,
    nimi: 'Molla',
    laji: 'Thai Siamese',
    city: 'Oulu',
    omistaja: 'Vilma',
    lelu: 'hiiri',
    kuva: '/assets/miri11.jpg',
    liked: false,
    available_from: '2023-12-15',
    available_until: '2024-01-09',
  },
  {
    id: 4,
    nimi: 'Miri',
    laji: 'Scottish long hair',
    city: 'Helsinki',
    omistaja: 'Mirva',
    lelu: 'pallo',
    kuva: '/assets/miri1.jpg',
    liked: false,
    available_from: '2023-12-09',
    available_until: '2024-12-09',
  },
  {
    id: 5,
    nimi: 'Musti',
    laji: 'Persian',
    city: 'Espoo',
    omistaja: 'Pekka',
    lelu: 'naru',
    kuva: '/assets/miri4.jpg',
    liked: false,
    available_from: '2023-12-09',
    available_until: '2023-12-24',
  },
  {
    id: 6,
    nimi: 'Molla',
    laji: 'Thai Siamese',
    city: 'Oulu',
    omistaja: 'Vilma',
    lelu: 'hiiri',
    kuva: '/assets/miri11.jpg',
    liked: true,
    available_from: '2023-12-09',
    available_until: '2023-12-24',
  },
];

function insertMockData() {
  catsDB.get('SELECT COUNT(*) AS count FROM cats', (err, row) => {
    if (err) {
      console.error('Error checking cats count:', err.message);
    } else if (row.count === 0) {
      const insertStmt = catsDB.prepare(
        'INSERT INTO cats (nimi, laji, city, omistaja, lelu, kuva, liked, available_from, available_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      );

      mockData.forEach((cat) => {
        const liked = cat.liked ? 1 : 0;
        insertStmt.run([cat.nimi, cat.laji, cat.city, cat.omistaja, cat.lelu, cat.kuva, liked, cat.available_from, cat.available_until], (err) => {
          if (err) {
            console.error('Error inserting mock data:', err.message);
          }
        });
      });

      insertStmt.finalize();
    } else {
      console.log('Mock data already exists');
    }
  });
}

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
    city TEXT,
    omistaja TEXT,
    lelu TEXT,
    kuva TEXT,
    liked INTEGER DEFAULT 0,
    available_from DATE,
    available_until DATE  
  )
`,
  (err) => {
    if (err) {
      console.error('Error creating cats table: ', err.message);
    } else {
      console.log('Cats table created or already exists');
      insertMockData();
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
  const { nimi, laji, city, omistaja, lelu, kuva, available_from, available_until } = req.body;

  catsDB.run(
    'INSERT INTO cats (nimi, laji, city, omistaja, lelu, kuva, available_from, available_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [nimi, laji, city, omistaja, lelu, kuva, available_from, available_until],
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
  const { city, startDate, endDate } = req.query;

  if (!city) {
    res.status(400).json({ error: 'City parameter is required' });
    return;
  }
  const query = 'SELECT * FROM cats WHERE city = ? AND available_from <= ? AND available_until >= ?';

  catsDB.all(query, [city, startDate, endDate], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});

app.get('/api/cats/:id', (req, res) => {
  const id = req.params.id;

  catsDB.get('SELECT * FROM cats WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (row) {
      res.json(row);
    } else {
      res.status(404).send('Cat not found');
    }
  });
});

app.put('/api/cats/:id', (req, res) => {
  const { id } = req.params;
  const { nimi, laji, city, omistaja, lelu, kuva, available_from, available_until } = req.body;

  catsDB.run(
    'UPDATE cats SET nimi = ?, laji = ?, city = ?, omistaja = ?, lelu = ?, kuva = ?, available_from = ?, available_until = ? WHERE id = ?',
    [nimi, laji, city, omistaja, lelu, kuva, available_from, available_until, id],
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

app.put('/api/cats/like/:id', (req, res) => {
  const id = req.params.id;
  const liked = req.body.liked;

  const likedInt = liked ? 1 : 0;

  catsDB.run('UPDATE cats SET liked = ? WHERE id = ?', [likedInt, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Cat not found' });
    } else {
      res.json({ message: 'Liked status updated successfully' });
    }
  });
});

app.get('/api/cats/search', (req, res) => {
  const { city, startDate, endDate } = req.query;

  if (!city) {
    res.status(400).json({ error: 'City parameter is required' });
    return;
  }
  const query = 'SELECT * FROM cats WHERE city = ? AND available_from <= ? AND available_until >= ?';

  catsDB.all(query, [city, startDate, endDate], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`server is runnig at http://localhost:${port}`);
});
