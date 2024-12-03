const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config');
const Admin = require('../models/Admin');

// Check admin status
router.get('/check-admin', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.json({ isAdmin: false });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const adminUser = await Admin.findOne({ userId: decodedToken.uid });
    res.json({ isAdmin: !!adminUser });
  } catch (error) {
    res.json({ isAdmin: false });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.status(201).json({ userId: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 