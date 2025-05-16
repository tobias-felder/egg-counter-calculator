// Twilio service configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Validate phone number format (10 digits)
export function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
}

// Format phone number for Twilio (add +1)
function formatPhoneNumber(phoneNumber) {
    return `+1${phoneNumber}`;
}

// Generate reminder message based on type
function generateMessage(type) {
    switch (type) {
        case 'period':
            return 'Reminder: Your next period is expected to start in 2 days.';
        case 'ovulation':
            return 'Reminder: Your ovulation day is tomorrow.';
        case 'fertility':
            return 'Reminder: Your fertile window begins tomorrow.';
        default:
            return 'Reminder from your fertility tracker.';
    }
}

// Send SMS using Twilio
export async function sendSMSReminder(phoneNumber, message) {
    try {
        const response = await fetch('/api/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: formatPhoneNumber(phoneNumber),
                message: message,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send SMS');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

// Schedule a reminder for a specific date
export async function scheduleReminder(date, type, phoneNumber) {
    try {
        const message = generateMessage(type);
        const response = await fetch('/api/schedule-reminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: formatPhoneNumber(phoneNumber),
                message: message,
                scheduledDate: date.toISOString(),
                reminderType: type,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to schedule reminder');
        }

        return await response.json();
    } catch (error) {
        console.error('Error scheduling reminder:', error);
        throw error;
    }
}

// Schedule reminder
function scheduleReminder(reminderData) {
    const { phone, type, days, eventDate } = reminderData;
    
    // Calculate reminder date (eventDate - days)
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(reminderDate.getDate() - parseInt(days));
    
    // For now, just log the scheduled reminder
    console.log('Reminder scheduled:', {
        phone,
        type,
        days,
        eventDate: eventDate.toISOString(),
        reminderDate: reminderDate.toISOString()
    });
    
    // Here you would typically use a job scheduler like node-cron
    // or a dedicated service like AWS Lambda + EventBridge
    return {
        success: true,
        scheduledDate: reminderDate,
        id: `reminder-${Date.now()}`
    };
}

// Export functions
module.exports = {
    sendSMSReminder,
    scheduleReminder,
    validatePhoneNumber
}; 