const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    // Seed the admin account if it doesn't exist
    seedAdmin();
  })
  .catch((err) => console.log('MongoDB connection error:', err));

// Seed default admin (only one admin user)
// You can customize the default admin credentials as needed.
async function seedAdmin() {
  try {
    const adminExists = await Admin.findOne({});
    if (!adminExists) {
      const defaultAdmin = {
        name: "Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("adminpassword", 10),
      };
      await Admin.create(defaultAdmin);
      console.log('Default admin created.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

// Routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
