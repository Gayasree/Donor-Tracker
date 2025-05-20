// routes/book.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/book', async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password',
    },
  });

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'You Have Been Booked as a Donor',
    text: 'Thank you for being a donor. A patient has requested your donation.',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
