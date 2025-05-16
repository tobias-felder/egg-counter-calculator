const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Create a new subscription
router.post('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { plan, startDate, endDate, status } = req.body;

        // Validate required fields
        if (!plan || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const subscriptionData = {
            userId,
            plan,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: status || 'active',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const subscriptionRef = await db.collection('subscriptions').add(subscriptionData);
        
        res.status(201).json({
            message: 'Subscription created successfully',
            id: subscriptionRef.id
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
});

// Get all subscriptions for a user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const subscriptionsSnapshot = await db.collection('subscriptions')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const subscriptions = [];
        subscriptionsSnapshot.forEach(doc => {
            subscriptions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(subscriptions);
    } catch (error) {
        console.error('Error getting subscriptions:', error);
        res.status(500).json({ error: 'Failed to get subscriptions' });
    }
});

// Get a specific subscription
router.get('/entry/:subscriptionId', async (req, res) => {
    try {
        const subscriptionId = req.params.subscriptionId;
        const subscriptionDoc = await db.collection('subscriptions').doc(subscriptionId).get();

        if (!subscriptionDoc.exists) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.status(200).json({
            id: subscriptionDoc.id,
            ...subscriptionDoc.data()
        });
    } catch (error) {
        console.error('Error getting subscription:', error);
        res.status(500).json({ error: 'Failed to get subscription' });
    }
});

// Update a subscription
router.put('/entry/:subscriptionId', async (req, res) => {
    try {
        const subscriptionId = req.params.subscriptionId;
        const { plan, startDate, endDate, status } = req.body;

        const updateData = {
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        if (plan) updateData.plan = plan;
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        if (status) updateData.status = status;

        await db.collection('subscriptions').doc(subscriptionId).update(updateData);
        
        res.status(200).json({ message: 'Subscription updated successfully' });
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Failed to update subscription' });
    }
});

// Cancel a subscription
router.delete('/entry/:subscriptionId', async (req, res) => {
    try {
        const subscriptionId = req.params.subscriptionId;
        await db.collection('subscriptions').doc(subscriptionId).update({
            status: 'cancelled',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.status(200).json({ message: 'Subscription cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
});

module.exports = router; 