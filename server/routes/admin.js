const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Item = require('../models/Item');
const Admin = require('../models/Admin');

// Get all items (admin view)
router.get('/items', adminAuth, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// Add new item
router.post('/items', adminAuth, async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      currentPrice: req.body.startingPrice,
      status: 'upcoming'
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: 'Error creating item' });
  }
});

// Update item
router.put('/items/:id', adminAuth, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: 'Error updating item' });
  }
});

// Delete item
router.delete('/items/:id', adminAuth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting item' });
  }
});

// Add new admin
router.post('/add-admin', adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const userRecord = await admin.auth().getUserByEmail(email);
    
    const newAdmin = new Admin({
      userId: userRecord.uid,
      email: userRecord.email
    });
    
    await newAdmin.save();
    res.status(201).json({ message: 'Admin added successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error adding admin' });
  }
});

module.exports = router; 