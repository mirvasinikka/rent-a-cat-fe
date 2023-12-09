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

const mockData = [];
const catNames = [
  'Miri',
  'Musti',
  'Molla',
  'Milla',
  'Missi',
  'Maissi',
  'Rölli',
  'Luna',
  'Leo',
  'Bella',
  'Milo',
  'Nala',
  'Simba',
  'Oliver',
  'Kitty',
  'Charlie',
  'Lucy',
  'Max',
  'Shadow',
  'Smokey',
  'Jasper',
  'Oreo',
  'Tiger',
  'Buddy',
  'Loki',
  'Stella',
  'Daisy',
  'Lily',
  'Zoe',
  'Coco',
  'Ruby',
  'Gracie',
  'Rosie',
  'Molly',
  'Frankie',
  'Felix',
  'Oscar',
  'Toby',
  'Gizmo',
  'Sam',
  'Sammy',
  'Tilly',
  'Penny',
  'Pepper',
  'Leo',
  'Jack',
  'George',
  'Roxy',
  'Rascal',
  'Sasha',
  'Ginger',
  'Midnight',
  'Boo',
  'Sunny',
  'Skye',
  'Angel',
];
const catBreeds = ['Scottish long hair', 'Persian', 'Thai Siamese'];
const cities = ['Helsinki', 'Espoo', 'Oulu', 'Vantaa', 'Tampere', 'Turku', 'Rovaniemi'];
const owners = ['Mirva', 'Pekka', 'Vilma', 'Jussi', 'Ida', 'Hilla', 'Tiina', 'Matti', 'Juhani'];
const toys = ['pallo', 'naru', 'hiiri', 'aktivointi-lelu', 'raapimapuu'];

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getRandomFutureDate = (startDate) => {
  const start = new Date(startDate);
  const end = new Date(2024, 6, 15);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

for (let i = 0; i < 200; i++) {
  const availableFrom = getCurrentDate();
  const availableUntil = getRandomFutureDate(availableFrom);

  const randomNameIndex = Math.floor(Math.random() * catNames.length);
  const randomBreedIndex = Math.floor(Math.random() * catBreeds.length);
  const randomCityIndex = Math.floor(Math.random() * cities.length);

  mockData.push({
    id: i + 1,
    nimi: catNames[randomNameIndex],
    laji: catBreeds[randomBreedIndex],
    city: cities[randomCityIndex],
    omistaja: owners[i % owners.length],
    lelu: toys[i % toys.length],
    kuva: `https://source.unsplash.com/featured/?cat,${i}`,
    liked: Math.random() < 0.5,
    available_from: availableFrom,
    available_until: availableUntil,
  });
}

console.log(mockData);

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

app.get('/api/allcats', (req, res) => {
  const query = 'SELECT * FROM cats';

  catsDB.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
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
