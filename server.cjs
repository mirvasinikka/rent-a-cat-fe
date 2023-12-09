const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use('/assets', express.static('public/assets'));

app.use(
  session({
    secret: 'cat-a-rent',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

const usersDB = new sqlite3.Database('./users.db');
const catsDB = new sqlite3.Database('./cats.db');

const mockCatData = [];
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

  mockCatData.push({
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

function insertCatMockData() {
  catsDB.get('SELECT COUNT(*) AS count FROM cats', (err, row) => {
    if (err) {
      console.error('Error checking cats count:', err.message);
    } else if (row.count === 0) {
      const insertStmt = catsDB.prepare(
        'INSERT INTO cats (nimi, laji, city, omistaja, lelu, kuva, liked, available_from, available_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      );

      mockCatData.forEach((cat) => {
        const liked = cat.liked ? 1 : 0;
        insertStmt.run([cat.nimi, cat.laji, cat.city, cat.omistaja, cat.lelu, cat.kuva, liked, cat.available_from, cat.available_until], (err) => {
          if (err) {
            console.error('Error inserting mock data:', err.message);
          }
        });
      });

      insertStmt.finalize();
    } else {
      console.log('Mock cat data already exists');
    }
  });
}

const mockUserData = [
  {
    username: 'admin',
    firstName: 'John',
    lastName: 'Doe',
    address: 'Helsinki, Finland',
    about: 'I enjoy cats!',
    avatarUrl: 'https://gravatar.com/avatar/f222a66c5c0db4441e8ef7690fd0302c?s=400&d=robohash&r=x',
    password: 'admin',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    username: 'normal',
    firstName: 'Jane',
    lastName: 'Doe',
    address: 'Espoo, Finland',
    about: 'I love cats!',
    avatarUrl: 'https://gravatar.com/avatar/f222a66c5c0db4441e8ef7690fd0302c?s=400&d=identicon&r=x',
    password: 'normal',
    email: 'normal@example.com',
    role: 'normal',
  },
];

function insertUserMockData() {
  usersDB.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
    if (err) {
      console.error('Error checking users count:', err.message);
    } else if (row.count === 0) {
      const insertStmt = usersDB.prepare(
        'INSERT INTO users (username, firstName, lastName, address, about, avatarUrl, password, email, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      );

      let completedInsertions = 0;

      mockUserData.forEach((user) => {
        bcrypt.hash(user.password, 10, (hashErr, hash) => {
          if (hashErr) {
            console.error('Error hashing password:', hashErr.message);
            return;
          }

          insertStmt.run(
            [user.username, user.firstName, user.lastName, user.address, user.about, user.avatarUrl, hash, user.email, user.role],
            (insertErr) => {
              if (insertErr) {
                console.error('Error inserting mock data:', insertErr.message);
              }

              completedInsertions++;

              if (completedInsertions === mockUserData.length) {
                insertStmt.finalize();
              }
            },
          );
        });
      });
    } else {
      console.log('Mock user data already exists');
    }
  });
}

// Create Users Table
usersDB.run(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    firstName TEXT,
    lastName TEXT,
    address TEXT,
    about TEXT,
    avatarUrl TEXT,
    password TEXT,
    email TEXT UNIQUE,
    role TEXT
  )
`,
  (err) => {
    if (err) {
      console.error('Error creating users table: ', err.message);
    } else {
      console.log('Users table created or already exists');
      insertUserMockData();
    }
  },
);

// Create Cats Table
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
      insertCatMockData();
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
    if (err) {
      // Send an error response and return to prevent further execution
      return res.status(400).json({ error: 'Username already taken or invalid input' });
    }

    // Send a success response
    res.json({ message: 'Registration successful' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  usersDB.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.user = { ...user, password: undefined };
    res.json({ message: 'Login successful' });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out, please try again' });
    }
    res.json({ message: 'Logout successful' });
  });
});

app.get('/api/user/profile', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.put('/api/user/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const updatedProfile = req.body;

  usersDB.run(
    'UPDATE users SET firstName = ?, lastName = ?, address = ?, about = ? WHERE username = ?',
    [updatedProfile.firstName, updatedProfile.lastName, updatedProfile.address, updatedProfile.about, req.session.user.username],
    (err) => {
      if (err) {
        console.error('Error updating user profile in the database:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      usersDB.get('SELECT * FROM users WHERE username = ?', [req.session.user.username], (err, row) => {
        if (err) {
          console.error('Error fetching updated user profile:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        req.session.user = row;
        res.json(row);
      });
    },
  );
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
