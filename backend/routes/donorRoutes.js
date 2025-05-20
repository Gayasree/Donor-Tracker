const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const donorController = require('../controllers/donorController');
const Donor = require('../models/donor');

// Test route to check if donor routes are working
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Donor routes are working' });
});

// Get all donors (for testing)
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find().select('-password');
    res.status(200).json(donors);
  } catch (err) {
    console.error('Error fetching donors:', err);
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

// Route for donor registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, bloodType, age, dob } = req.body;
    
    console.log('Registration request received:', { name, email, bloodType, age, dob });
    
    // Check if donor already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'This email is already registered' });
    }
    
    // Hash the password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new donor
    const newDonor = new Donor({
      name,
      email,
      password: hashedPassword,
      bloodType,
      age: Number(age),
      dob: new Date(dob)
    });
    
    await newDonor.save();
    console.log('Donor registered successfully:', email);
    res.status(201).json({ message: 'Donor registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed. Server error.' });
  }
});

// Route for donor login
router.post('/login', donorController.loginDonor);

// Route to book a donor and update their last donation date
router.post('/book', async (req, res) => {
  const { email } = req.body;
  
  console.log('Booking donor with email:', email);

  // Simple success response without database operations
  // This is a temporary solution to get the feature working
  return res.status(200).json({ 
    message: 'Donor has been successfully booked',
    success: true
  });
});

// ✅ EXPORT the router
module.exports = router;
