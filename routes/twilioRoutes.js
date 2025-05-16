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

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    res.json({
      success: true,
      data: {
        messageId: response.sid,
        status: response.status
      }
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send SMS'
    });
  }
});

// Handle incoming SMS webhook
router.post('/webhook', (req, res) => {
  try {
    const { Body, From } = req.body;
    
    // Log incoming message
    console.log(`Received message from ${From}: ${Body}`);

    // Create TwiML response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Thank you for your message. We will get back to you soon.');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

module.exports = router; 