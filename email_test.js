require('dotenv').config();
const nodemailer = require('nodemailer');

// Create email transporter
async function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
}

// Send test email
async function sendTestEmail() {
  try {
    console.log('Attempting to send email...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', process.env.TEST_EMAIL);
    
    const transporter = await createTransporter();
    
    const info = await transporter.sendMail({
      from: `"Reproductive Health Timeline" <${process.env.EMAIL_USER}>`,
      to: process.env.TEST_EMAIL,
      subject: 'Reproductive Health Timeline - Notification Test',
      text: 'This is a test notification from your Reproductive Health Timeline application.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Reproductive Health Timeline</h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #2c3e50; font-size: 16px; margin-bottom: 15px;">This is a test notification from your fertility tracking application.</p>
            
            <p style="color: #2c3e50; font-size: 16px; margin-bottom: 15px;">When fully implemented, you will receive notifications for:</p>
            <ul style="color: #2c3e50; font-size: 16px;">
              <li>Upcoming fertility windows</li>
              <li>Cycle predictions</li>
              <li>Important milestones</li>
              <li>Custom reminders</li>
            </ul>
          </div>

          <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error.message);
    console.error('Full error:', error);
  }
}

sendTestEmail(); 