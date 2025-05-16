const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
console.log('Environment variables loaded:');
console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
console.log('SENDGRID_API_KEY length:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0);
// Import the product database
const productDatabase = require('./src/config/products');

// Product recommendation function
function getRecommendedProducts(age) {
  return productDatabase.filter(
    p => age >= p.ageRange[0] && age <= p.ageRange[1]
  );
}

const app = express();
const PORT = 3000;

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// Initialize SQLite database
const db = new sqlite3.Database('egg_counter.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
    
    // Create tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        age INTEGER,
        lastPeriod TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        data TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Health check endpoint
app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Calculator endpoint
app.get('/calculator', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Email endpoint with product recommendations
app.post('/api/send-email', async (req, res) => {
    try {
        const { email, calculatorData } = req.body;
        
        // Check if we have all required data
        if (!email || !calculatorData || !calculatorData.age || !calculatorData.eggCountInfo) {
            console.error('Missing required data:', { email, calculatorData });
            return res.status(400).json({ error: 'Missing required data' });
        }

        const { age, eggCountInfo, cycleInfo } = calculatorData;
        
        // More defensive checks
        if (!eggCountInfo.current) {
            console.error('Missing egg count info:', eggCountInfo);
            return res.status(400).json({ error: 'Missing egg count information' });
        }

        console.log('Received email request:', { email, age, eggCountInfo, cycleInfo });

        // Get recommended products
        const recommendedProducts = getRecommendedProducts(age);

        // Build product section HTML
        let productSection = '';
        if (recommendedProducts.length > 0) {
            productSection = `
                <div style="margin: 20px 0;">
                    <h2 style="color: #34495e;">Recommended Products</h2>
                    <ul>
                        ${recommendedProducts.map(p => `
                            <li>
                                <a href="${p.affiliateLink}" target="_blank"><strong>${p.name}</strong></a>: ${p.description}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        const msg = {
            to: email,
            from: 'tobias.felder@gmail.com',
            subject: 'Your Personalized Fertility Report',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2c3e50; text-align: center;">Your Personalized Fertility Report</h1>
                    
                    <div style="margin: 20px 0;">
                        <h2 style="color: #34495e;">Age Information</h2>
                        <p><strong>Current Age:</strong> ${age}</p>
                        <p><strong>Egg Count Range:</strong> ${eggCountInfo.current}</p>
                        <p><strong>Change from 5 years ago:</strong> ${eggCountInfo.past}</p>
                        <p><strong>Projected change in 5 years:</strong> ${eggCountInfo.future}</p>
                    </div>
        
                    <div style="margin: 20px 0;">
                        <h2 style="color: #34495e;">Cycle Information</h2>
                        <p><strong>Next Period:</strong> ${cycleInfo.nextPeriod}</p>
                        <p><strong>Ovulation Day:</strong> ${cycleInfo.ovulationDay}</p>
                        <p><strong>Fertile Window:</strong> ${cycleInfo.fertileWindow}</p>
                    </div>
        
                    <div style="margin: 20px 0;">
                        <h2 style="color: #34495e;">Your Subscription Information</h2>
                        <p><strong>Current Plan:</strong> ${calculatorData.subscriptionInfo.currentPlan}</p>
                        <p><strong>Available Features:</strong> ${calculatorData.subscriptionInfo.availableFeatures}</p>
                        <p><strong>Next Billing Date:</strong> ${calculatorData.subscriptionInfo.nextBillingDate}</p>
                        <div style="margin-top: 15px;">
                            <h3 style="color: #34495e;">Notification Preferences</h3>
                            <p><strong>Fertility Updates:</strong> ${calculatorData.subscriptionInfo.fertilityUpdates ? 'Enabled' : 'Disabled'}</p>
                            <p><strong>Cycle Reminders:</strong> ${calculatorData.subscriptionInfo.cycleReminders ? 'Enabled' : 'Disabled'}</p>
                            <p><strong>Update Frequency:</strong> ${calculatorData.subscriptionInfo.updateFrequency}</p>
                        </div>
                    </div>
        
                    ${productSection}
                </div>
            `
        };

        console.log('Attempting to send email with SendGrid...');
        console.log('Message details:', {
            to: msg.to,
            from: msg.from,
            subject: msg.subject
        });
        console.log('SendGrid API Key first 10 chars:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...');

        try {
            await sgMail.send(msg);
            console.log('Email sent successfully');
            res.json({ success: true, message: 'Email sent successfully' });
        } catch (sendError) {
            console.error('SendGrid specific error:', {
                message: sendError.message,
                code: sendError.code,
                response: sendError.response ? {
                    body: sendError.response.body,
                    statusCode: sendError.response.statusCode,
                    headers: sendError.response.headers
                } : 'No response',
                stack: sendError.stack
            });
            throw sendError;
        }
    } catch (error) {
        console.error('Detailed error sending email:', {
            message: error.message,
            response: error.response ? {
                body: error.response.body,
                statusCode: error.response.statusCode,
                headers: error.response.headers
            } : 'No response',
            stack: error.stack
        });
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Calculator available at http://localhost:${PORT}/calculator`);
});