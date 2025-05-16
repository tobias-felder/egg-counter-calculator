const path = require('path');
const dotenv = require('dotenv');
const EmailService = require('./email-service/emailService');
require('dotenv').config();

// Load .env file explicitly
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env file from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

// Verify environment variables
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
    console.error('Missing required environment variables:');
    console.error('EMAIL_USER:', emailUser ? 'Set' : 'Missing');
    console.error('EMAIL_PASS:', emailPass ? 'Set' : 'Missing');
    process.exit(1);
}

console.log('Starting email test...');
console.log('Current directory:', process.cwd());
console.log('Environment variables:', {
    EMAIL_USER: emailUser,
    EMAIL_PASS: emailPass ? 'Set' : 'Missing',
    NODE_ENV: process.env.NODE_ENV || 'Not set'
});
console.log('EMAIL_USER is set:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASS is set:', !!process.env.EMAIL_PASS);

async function testEmail() {
    try {
        console.log('Testing email service...');
        
        const result = await EmailService.sendCalculatorResults({
            email: 'tobias.felder@gmail.com',
            age: 30,
            lastPeriodDate: '2024-04-23',
            estimatedEggCount: '500,000',
            fertilityStatus: 'Good',
            nextPeriod: '2024-05-21',
            ovulationDay: '2024-05-07',
            fertileWindow: '2024-05-05 to 2024-05-09',
            ovulationTime: '2024-05-07 14:00'
        });

        console.log('Email test result:', result);
    } catch (error) {
        console.error('Error testing email:', error);
    }
}

testEmail(); 