const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();

// User registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      subscriptionStatus: 'free',
      settings: {
        notifications: true,
        emailNotifications: true,
        reminderTime: '09:00'
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
});

// User login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Update last login time
    await admin.firestore().collection('users').doc(userRecord.uid).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: 'Login successful',
      uid: userRecord.uid
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.email;
    delete updates.subscriptionStatus;
    delete updates.createdAt;

    await admin.firestore().collection('users').doc(userId).update(updates);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 