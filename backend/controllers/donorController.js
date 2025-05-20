const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Donor = require('../models/donor');

exports.registerDonor = async (req, res) => {
  const { name, email, password, age, dob, bloodType } = req.body;

  try {
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: 'This email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDonor = new Donor({
      name,
      email,
      password: hashedPassword,
      age,
      dob,
      bloodType
    });

    await newDonor.save();
    res.status(201).json({ message: 'Donor registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginDonor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: donor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findById(req.donor._id).select('-password');
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json(donor);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
