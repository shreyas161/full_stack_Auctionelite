const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/protected-route', verifyToken, async (req, res) => {
  try {
    // The user is authenticated, req.user contains the decoded token
    res.json({ message: 'Protected data', user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 