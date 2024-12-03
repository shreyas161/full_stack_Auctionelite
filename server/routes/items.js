const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config');

// Format price in rupees
const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

// Get all items
router.get('/', async (req, res) => {
  try {
    const itemsRef = admin.firestore().collection('items');
    const snapshot = await itemsRef.orderBy('createdAt', 'desc').get();
    
    const items = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      items.push({ 
        id: doc.id, 
        ...data,
        startingPrice: formatPrice(data.startingPrice),
        currentPrice: formatPrice(data.currentPrice || data.startingPrice)
      });
    });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const itemRef = admin.firestore().collection('items').doc(req.params.id);
    const doc = await itemRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const data = doc.data();
    res.json({ 
      id: doc.id, 
      ...data,
      startingPrice: formatPrice(data.startingPrice),
      currentPrice: formatPrice(data.currentPrice || data.startingPrice),
      bidHistory: data.bidHistory?.map(bid => ({
        ...bid,
        amount: formatPrice(bid.amount)
      })) || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching item' });
  }
});

// Add bid
router.post('/:id/bid', async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const itemRef = admin.firestore().collection('items').doc(req.params.id);
    
    await itemRef.update({
      currentPrice: amount,
      [`bidHistory.${Date.now()}`]: {
        amount,
        userId,
        timestamp: new Date().toISOString()
      }
    });

    res.json({ message: 'Bid placed successfully', amount: formatPrice(amount) });
  } catch (error) {
    res.status(500).json({ error: 'Error placing bid' });
  }
});

module.exports = router; 