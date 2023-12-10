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
const likedCatsDB = new sqlite3.Database('./liked-cats.db');
const rentDB = new sqlite3.Database('./rent.db');

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

const getRandomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

for (let i = 0; i < 200; i++) {
  const availableFrom = getCurrentDate();
  const availableUntil = getRandomFutureDate(availableFrom);
  const randomPrice = getRandomNumberBetween(5, 35);

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
    likes: 0,
    available_from: availableFrom,
    available_until: availableUntil,
    price: randomPrice,
  });
}

function insertCatMockData() {
  catsDB.get('SELECT COUNT(*) AS count FROM cats', (err, row) => {
    if (err) {
      console.error('Error checking cats count:', err.message);
    } else if (row.count === 0) {
      const insertStmt = catsDB.prepare(
        'INSERT INTO cats (nimi, laji, city, omistaja, lelu, kuva, likes, available_from, available_until, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      );

      mockCatData.forEach((cat) => {
        const likes = cat.likes ? 1 : 0;
        insertStmt.run(
          [cat.nimi, cat.laji, cat.city, cat.omistaja, cat.lelu, cat.kuva, likes, cat.available_from, cat.available_until, cat.price],
          (err) => {
            if (err) {
              console.error('Error inserting mock data:', err.message);
            }
          },
        );
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
    likes INTEGER DEFAULT 0,
    available_from DATE,
    available_until DATE, 
    price INTEGER 
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

// Create Likes Table
likedCatsDB.run(
  `
  CREATE TABLE IF NOT EXISTS likedCats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    catId INTEGER,
    userId INTEGER,
    FOREIGN KEY (catId) REFERENCES cats(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`,
  (err) => {
    if (err) {
      console.error('Error creating likedCats table: ', err.message);
    } else {
      console.log('likedCats table created or already exists');
    }
  },
);

// Creating rents
rentDB.run(
  `
  CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    catId INTEGER,
    userId INTEGER,
    usersName TEXT,
    userEmail TEXT,
    rentStartDate TEXT,
    rentEndDate TEXT,
    price INTEGER,
    FOREIGN KEY (catId) REFERENCES cats(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`,
  (err) => {
    if (err) {
      console.error('Error creating rentals table: ', err.message);
    } else {
      console.log('Rentals table created or already exists');
    }
  },
);

app.get('/api/data', (req, res) => {
  const query = 'SELECT * FROM likedCats';

  likedCatsDB.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
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
    'INSERT INTO cats (nimi, laji, city, omistaja, lelu, kuva, available_from, available_until, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nimi, laji, city, omistaja, lelu, kuva, available_from, available_until, price],
    (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: 'Cat added successfully' });
    },
  );
});

app.get('/api/cats', async (req, res) => {
  const { city, startDate, endDate } = req.query;
  const userId = req.session.user?.id;

  try {
    let catsQuery;
    let likedCatsQuery;
    let catsRows;
    let likedCatsRows;

    if (!city) {
      catsQuery = 'SELECT * FROM cats';
      likedCatsQuery = 'SELECT catId FROM likedCats WHERE userId = ?';

      catsRows = await queryDatabase(catsDB, catsQuery);
      likedCatsRows = await queryDatabase(likedCatsDB, likedCatsQuery, [userId]);
    } else {
      catsQuery = 'SELECT * FROM cats WHERE city = ? AND available_from <= ? AND available_until >= ?';
      likedCatsQuery = 'SELECT catId FROM likedCats WHERE userId = ?';

      catsRows = await queryDatabase(catsDB, catsQuery, [city, startDate, endDate]);
      likedCatsRows = await queryDatabase(likedCatsDB, likedCatsQuery, [userId]);
    }

    const likedCatsIds = likedCatsRows.map((row) => row.catId);

    // Combine the results
    const combinedRows = catsRows.map((cat) => ({
      ...cat,
      likes: likedCatsIds.includes(cat.id) ? 1 : 0,
    }));

    res.json(combinedRows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function for querying the database
function queryDatabase(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

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
    'UPDATE cats SET nimi = ?, laji = ?, city = ?, omistaja = ?, lelu = ?, kuva = ?, available_from = ?, available_until = ? price = ? WHERE id = ?',
    [nimi, laji, city, omistaja, lelu, kuva, available_from, available_until, price, id],
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

app.put('/api/cats/like/:id', async (req, res) => {
  const catId = req.params.id;
  const userId = req.session.user?.id || 1;

  const queryCheckLike = 'SELECT * FROM likedCats WHERE catId = ? AND userId = ?';
  const queryInsertLike = 'INSERT INTO likedCats (catId, userId) VALUES (?, ?)';
  const queryRemoveLike = 'DELETE FROM likedCats WHERE catId = ? AND userId = ?';
  const queryUpdateLikes = 'UPDATE cats SET likes = likes + ? WHERE id = ?';

  likedCatsDB.get(queryCheckLike, [catId, userId], async (err, existingLike) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (existingLike) {
      likedCatsDB.run(queryRemoveLike, [catId, userId], (removeErr) => {
        if (removeErr) {
          res.status(500).json({ error: removeErr.message });
          return;
        }

        catsDB.run(queryUpdateLikes, [-1, catId], (updateErr) => {
          if (updateErr) {
            res.status(500).json({ error: updateErr.message });
            return;
          }

          res.json({ message: 'Cat unliked successfully' });
        });
      });
    } else {
      likedCatsDB.run(queryInsertLike, [catId, userId], (insertErr) => {
        if (insertErr) {
          res.status(500).json({ error: insertErr.message });
          return;
        }

        catsDB.run(queryUpdateLikes, [1, catId], (updateErr) => {
          if (updateErr) {
            res.status(500).json({ error: updateErr.message });
            return;
          }

          res.json({ message: 'Cat liked successfully' });
        });
      });
    }
  });
});

app.get('/api/user/liked-cats', (req, res) => {
  const userId = req.session.user.id;

  try {
    const catsQuery = 'SELECT * FROM cats';
    const likedCatsQuery = 'SELECT * FROM likedCats WHERE userId = ?';

    catsDB.all(catsQuery, [], (catsErr, catsRows) => {
      if (catsErr) {
        res.status(500).json({ error: catsErr.message });
        return;
      }

      likedCatsDB.all(likedCatsQuery, [userId], (likedCatsErr, likedCatsRows) => {
        if (likedCatsErr) {
          res.status(500).json({ error: likedCatsErr.message });
          return;
        }

        const likedCats = catsRows.filter((cat) => {
          return likedCatsRows.some((lc) => lc.catId === cat.id);
        });

        res.json(likedCats);
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

app.post('/api/rent-cat', (req, res) => {
  const { catId, usersName, userEmail, rentStartDate, rentEndDate } = req.body;

  const sql = `INSERT INTO rentals (catId, usersName, userEmail, rentStartDate, rentEndDate) VALUES (?, ?, ?, ?, ?)`;

  rentDB.run(sql, [catId, usersName, userEmail, rentStartDate, rentEndDate], function (err) {
    if (err) {
      console.error('Error inserting rental data:', err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(200).json({ message: 'Cat rental successfully recorded', rentalId: this.lastID });
  });
});

app.get('/api/rentals', (req, res) => {
  const userId = req.session.user.id;

  try {
    const rentalsQuery = 'SELECT * FROM rentals WHERE userId = ?';

    rentDB.all(rentalsQuery, [userId], (rentalsErr, rentalsRows) => {
      if (rentalsErr) {
        res.status(500).json({ error: rentalsErr.message });
        return;
      }

      res.json(rentalsRows);

      if (rentalsRows.length === 0) {
        return res.json([]);
      }

      const catIds = rentalsRows.map((rental) => rental.catId);

      const catsQuery = `SELECT * FROM cats WHERE id IN (${catIds.join(',')})`;

      catsDB.all(catsQuery, [], (catsErr, catsRows) => {
        if (catsErr) {
          res.status(500).json({ error: catsErr.message });
          return;
        }

        const combinedData = rentalsRows.map((rental) => {
          return {
            ...rental,
            catDetails: catsRows.find((cat) => cat.id === rental.catId) || {},
          };
        });

        res.json(combinedData);
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`server is runnig at http://localhost:${port}`);
});
