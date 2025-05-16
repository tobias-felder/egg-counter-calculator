// Email configuration
const emailConfig = {
    // Email templates
    templates: {
        fertilityUpdate: {
            subject: 'Your Fertility Wellness Update',
            text: 'Dear {name},\n\nYour fertility wellness update:\n- Age: {age}\n- Estimated Egg Count: {eggCount}\n- Status: {status}\n\nNext Steps:\n{nextSteps}\n\nBest regards,\nFertility Wellness Tracker',
            html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' +
                  '<h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Fertility Wellness Update</h2>' +
                  '<div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">' +
                  '<p style="color: #2c3e50; font-size: 16px; margin-bottom: 15px;">Dear {name},</p>' +
                  '<h3 style="color: #2c3e50; margin-bottom: 15px;">Your Current Status</h3>' +
                  '<ul style="color: #2c3e50; font-size: 16px;">' +
                  '<li>Age: {age}</li>' +
                  '<li>Estimated Egg Count: {eggCount}</li>' +
                  '<li>Status: {status}</li>' +
                  '</ul>' +
                  '<h3 style="color: #2c3e50; margin-top: 20px; margin-bottom: 15px;">Next Steps</h3>' +
                  '<ul style="color: #2c3e50; font-size: 16px;">' +
                  '{nextSteps.map(step => `<li>${step}</li>`).join("")}' +
                  '</ul>' +
                  '</div>' +
                  '<p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">This is an automated message from Fertility Wellness Tracker. Please do not reply to this email.</p>' +
                  '</div>'
        },
        cycleReminder: {
            subject: 'Your Cycle Reminder',
            text: 'Dear {name},\n\nThis is a reminder that your next cycle is approaching.\n- Expected Start Date: {startDate}\n- Cycle Length: {cycleLength} days\n\nBest regards,\nFertility Wellness Tracker',
            html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' +
                  '<h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Cycle Reminder</h2>' +
                  '<div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">' +
                  '<p style="color: #2c3e50; font-size: 16px; margin-bottom: 15px;">Dear {name},</p>' +
                  '<p style="color: #2c3e50; font-size: 16px;">This is a reminder that your next cycle is approaching.</p>' +
                  '<ul style="color: #2c3e50; font-size: 16px;">' +
                  '<li>Expected Start Date: {startDate}</li>' +
                  '<li>Cycle Length: {cycleLength} days</li>' +
                  '</ul>' +
                  '</div>' +
                  '<p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">This is an automated message from Fertility Wellness Tracker. Please do not reply to this email.</p>' +
                  '</div>'
        }
    },

    // Notification settings
    notifications: {
        fertilityUpdate: {
            frequency: 'monthly',
            time: '10:00'
        },
        cycleReminder: {
            frequency: 'weekly',
            time: '09:00'
        }
    },

    // Sender information
    sender: {
        name: 'Fertility Wellness Tracker',
        email: 'tobias.felder@gmail.com' // Using the verified email address
    }
};

module.exports = emailConfig; 