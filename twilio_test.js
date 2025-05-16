require('dotenv').config();
const twilio = require('twilio');

// Create Twilio client using environment variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send test message
async function sendTestMessage() {
  try {
    console.log('Attempting to send message...');
    console.log('From:', process.env.TWILIO_PHONE_NUMBER);
    console.log('To:', process.env.TEST_PHONE_NUMBER);
    
    const message = await client.messages.create({
      body: 'TEST MESSAGE #1 - Egg Counter Calculator: If you receive this, please respond YES.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.TEST_PHONE_NUMBER
    });
    
    console.log('Test message sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Message status:', message.status);
  } catch (error) {
    console.error('Error sending message:', error.message);
    console.error('Full error:', error);
  }
}

sendTestMessage(); 