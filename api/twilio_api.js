const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS endpoint
router.post('/send-sms', async (req, res) => {
    try {
        const { to, message } = req.body;

        const twilioMessage = await client.messages.create({
            body: message,
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        res.json({
            success: true,
            messageId: twilioMessage.sid
        });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Schedule reminder endpoint
router.post('/schedule-reminder', async (req, res) => {
    try {
        const { phoneNumber, message, scheduledDate, reminderType } = req.body;

        // Store reminder in database (implementation needed)
        const reminder = {
            phoneNumber,
            message,
            scheduledDate: new Date(scheduledDate),
            reminderType,
            status: 'scheduled'
        };

        // For now, we'll just log the scheduled reminder
        console.log('Scheduled reminder:', reminder);

        res.json({
            success: true,
            reminder: reminder
        });
    } catch (error) {
        console.error('Error scheduling reminder:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 