require('dotenv').config();
const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email templates
const templates = {
    fertilityWindow: {
        subject: 'Your Fertility Window Update',
        body: (data) => `
            <h2>Your Fertility Window Information</h2>
            <p>Based on your cycle information, here are your important dates:</p>
            <ul>
                <li><strong>Fertile Window Start:</strong> ${data.startDate}</li>
                <li><strong>Fertile Window End:</strong> ${data.endDate}</li>
                <li><strong>Predicted Ovulation Day:</strong> ${data.ovulationDate}</li>
            </ul>
            <p>Mark these dates in your calendar to optimize your fertility planning.</p>
        `
    },
    eggCountUpdate: {
        subject: 'Your Egg Count Update',
        body: (data) => `
            <h2>Your Egg Count Information</h2>
            <p>Based on your current age of ${data.age}, here's your egg count update:</p>
            <ul>
                <li><strong>Estimated Egg Range:</strong> ${data.eggRange}</li>
                <li><strong>Change from Previous Year:</strong> ${data.change}% decrease</li>
            </ul>
            <p>Understanding your egg count can help you make informed decisions about your fertility journey.</p>
        `
    },
    cycleReminder: {
        subject: 'Your Cycle Information Update',
        body: (data) => `
            <h2>Your Cycle Information</h2>
            <p>Here are your important upcoming dates:</p>
            <ul>
                <li><strong>Next Expected Period:</strong> ${data.nextPeriod}</li>
                <li><strong>Predicted Ovulation Day:</strong> ${data.ovulationDay}</li>
            </ul>
            <p>Keep track of these dates to better understand your cycle patterns.</p>
        `
    },
    custom: {
        subject: 'Fertility Tracking Update',
        body: (data) => `
            <h2>${data.title}</h2>
            <p>${data.message}</p>
        `
    }
};

// Function to send notifications
async function sendNotification(email, type, data) {
    if (!templates[type]) {
        throw new Error(`Invalid notification type: ${type}`);
    }

    const template = templates[type];
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: template.subject,
        html: template.body(data)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = {
    sendNotification
}; 