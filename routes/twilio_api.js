const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Send SMS notification
router.post('/send-sms', async (req, res) => {
    try {
        const { to, message } = req.body;
        
        // Validate phone number and message
        if (!to || !message) {
            return res.status(400).json({
                success: false,
                error: 'Phone number and message are required'
            });
        }

        // Send message using Twilio
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        res.json({
            success: true,
            message: 'SMS sent successfully',
            messageId: response.sid
        });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send SMS',
            details: error.message
        });
    }
});

// Get message status
router.get('/message-status/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        
        const message = await client.messages(messageId).fetch();
        
        res.json({
            success: true,
            status: message.status,
            details: message
        });
    } catch (error) {
        console.error('Error fetching message status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch message status',
            details: error.message
        });
    }
});

module.exports = router; 