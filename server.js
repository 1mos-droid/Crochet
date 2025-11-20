// --- 1. IMPORTS ---
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- NEW: Import LowDB ---
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// --- 2. APP SETUP ---
const app = express();
const port = 3000;
const JWT_SECRET = 'my-super-secret-key-12345';

// --- 3. DATABASE SETUP (Replaces In-Memory Arrays) ---

// Setup the database adapter
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default data *if* the db.json file is empty
// This is how your products get into the database!
db.defaults({
  products: [
    { id:1, name:'Cozy Sweater', category:'Clothing', price:50, yarn:'Wool', size:'M', img:'/images/1000082759-removebg-preview.png' },
    { id:2, name:'Handmade Bag', category:'Bags', price:80, yarn:'Cotton', size:'L', img:'/images/1000082753-removebg-preview.png' },
    { id:3, name:'Plushie Toy', category:'Plushies', price:25, yarn:'Acrylic', size:'S', img:'/images/1000082727-removebg-preview.png' },
    { id:4, name:'Decor Pillow', category:'Home Decor', price:40, yarn:'Cotton', size:'M', img:'/images/1000082745-removebg-preview.png' },
    { id:5, name:'Baby Booties', category:'Baby Items', price:30, yarn:'Wool', size:'S', img:'/images/1000082761-removebg-preview.png' }
  ],
  users: [],
  customOrders: [] // Added a place to save custom orders
}).write(); // .write() saves the changes to db.json

// --- 4. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// --- 5. API ROUTES (Now using 'db' instead of arrays) ---

// A) Product Routes
app.get('/api/products', (req, res) => {
  console.log('GET /api/products - Reading from db.json');
  // NEW: Read from the database
  const products = db.get('products').value();
  res.json(products);
});

// B) Custom Order Routes
app.post('/api/custom-order', (req, res) => {
  const orderData = req.body;
  console.log('POST /api/custom-order - Writing to db.json');
  
  // NEW: Save the order to the database
  db.get('customOrders')
    .push(orderData)
    .write(); // Don't forget .write()!

  res.status(201).json({ 
    message: 'Order received successfully!',
    receivedData: orderData 
  });
});

// C) Authentication Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields.' });
    }

    // NEW: Check if user exists in the database
    const existingUser = db.get('users').find({ email: email }).value();
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // NEW: Save the new user to the database
    const newUser = {
      id: db.get('users').value().length + 1, // Simple ID
      name,
      email,
      password: hashedPassword
    };
    db.get('users').push(newUser).write();

    console.log('New user registered:', newUser.email);
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // NEW: Find the user in the database
    const user = db.get('users').find({ email: email }).value();
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // --- Login Successful! ---
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('User logged in:', user.email);
    res.json({
      message: 'Login successful!',
      token: token,
      user: { name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// --- 6. START THE SERVER ---
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
  console.log("Database is running in 'db.json'");
});


 
 
 