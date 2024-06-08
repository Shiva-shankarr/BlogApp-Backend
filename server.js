const express = require('express');
const app = express();
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

// Environment variables
const { PORT, DB_URL } = process.env;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db('BlogAppDB');
    const userCollection = db.collection('users');
    const authorCollection = db.collection('authorCollection');
    const articlesCollection = db.collection('articlesCollection');
    const adminCollection = db.collection('AdminCollection');

    app.set('userCollection', userCollection);
    app.set('authorCollection', authorCollection);
    app.set('articlesCollection', articlesCollection);
    app.set('adminCollection', adminCollection);

    console.log('DB connect success');
  })
  .catch(err => {
    console.error('Error occurred in DB connection:', err);
    process.exit(1); // Exit the process on connection error
  });

// API routes
app.use('/user-api', require('./APIs/users-api'));
app.use('/author-api', require('./APIs/author-api'));
app.use('/admin-api', require('./APIs/admin-api'));

// Error handling middleware (should be at the end)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT || 5000, () => {
  console.log(`Server running at port ${PORT || 5000}`);
});
