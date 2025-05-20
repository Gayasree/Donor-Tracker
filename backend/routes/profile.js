const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Donor = require('../models/donor'); 
const verifyToken = require('../middleware/authMiddleware');

// GET profile
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('Getting profile for user ID:', req.user.id);
    
    const donor = await Donor.findById(req.user.id).select('-password');
    
    if (!donor) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Profile found:', donor.email);
    res.json(donor);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all donors (for donor list)
router.get('/donors', async (req, res) => {
  try {
    // Fetch all donors but exclude password field
    const donors = await Donor.find().select('-password');
    console.log('Fetched donors:', donors);
    res.json(donors);
  } catch (err) {
    console.error('Error fetching donors:', err);
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

// Test route to check if profile routes are working
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Profile routes are working' });
});

// UPDATE profile
router.put('/update', verifyToken, async (req, res) => {
  try {
    console.log('Updating profile for user ID:', req.user.id);
    console.log('Update data:', req.body);
    
    const { lastDonationDate, patientCount } = req.body;
    
    // Prepare update object
    const updateData = {};
    if (lastDonationDate) updateData.lastDonationDate = new Date(lastDonationDate);
    if (patientCount !== undefined) updateData.patientCount = Number(patientCount);
    
    console.log('Processed update data:', updateData);
    
    const updated = await Donor.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!updated) {
      console.log('User not found for update with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Profile updated successfully for:', updated.email);
    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
