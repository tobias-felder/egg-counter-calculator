const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();

// Create a new tracking entry
router.post('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const trackingData = {
      ...req.body,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore().collection('tracking').add(trackingData);
    
    res.status(201).json({
      message: 'Tracking entry created successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error creating tracking entry:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all tracking entries for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const snapshot = await admin.firestore()
      .collection('tracking')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const entries = [];
    snapshot.forEach(doc => {
      entries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(entries);
  } catch (error) {
    console.error('Error fetching tracking entries:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific tracking entry
router.get('/entry/:entryId', async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const doc = await admin.firestore().collection('tracking').doc(entryId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Tracking entry not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching tracking entry:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a tracking entry
router.put('/entry/:entryId', async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.userId;
    delete updates.createdAt;

    await admin.firestore().collection('tracking').doc(entryId).update(updates);
    res.json({ message: 'Tracking entry updated successfully' });
  } catch (error) {
    console.error('Error updating tracking entry:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a tracking entry
router.delete('/entry/:entryId', async (req, res) => {
  try {
    const entryId = req.params.entryId;
    await admin.firestore().collection('tracking').doc(entryId).delete();
    res.json({ message: 'Tracking entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting tracking entry:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 