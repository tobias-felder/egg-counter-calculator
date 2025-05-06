// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const EmailService = require('./services/emailService');

const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'src'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// API Routes
app.post('/api/send-results', async (req, res) => {
    try {
        const { email, calculatorData } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        if (!process.env.SENDGRID_API_KEY) {
            console.error('SendGrid API key is missing');
            return res.status(500).json({ 
                success: false, 
                error: 'Email service is not properly configured. Please contact support.' 
            });
        }

        const emailService = new EmailService();
        const result = await emailService.sendCalculatorResults(email, calculatorData);
        
        if (result.success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send email. Please try again later.' 
        });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
    });
});

// Start server
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY ? 'Configured' : 'Missing');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Don't exit the process, just log the error
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
}); 