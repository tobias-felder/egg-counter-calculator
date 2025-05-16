require('dotenv').config();
const nodemailer = require('nodemailer');

class NotificationSystem {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  // Email Templates
  getEmailTemplate(type, data) {
    const templates = {
      fertilityWindow: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Fertility Window Alert</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #2c3e50; font-size: 16px;">Your fertile window is approaching:</p>
            <ul style="color: #2c3e50; font-size: 16px;">
              <li>Start Date: ${data.startDate}</li>
              <li>End Date: ${data.endDate}</li>
              <li>Optimal Day: ${data.ovulationDate}</li>
            </ul>
          </div>
        </div>
      `,

      eggCountUpdate: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Egg Count Update</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #2c3e50; font-size: 16px;">Your current reproductive health status:</p>
            <ul style="color: #2c3e50; font-size: 16px;">
              <li>Current Age: ${data.age}</li>
              <li>Estimated Egg Count Range: ${data.eggRange}</li>
              <li>Change from Last Period: ${data.change}</li>
            </ul>
          </div>
        </div>
      `,

      cycleReminder: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Cycle Reminder</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #2c3e50; font-size: 16px;">Important dates for your cycle:</p>
            <ul style="color: #2c3e50; font-size: 16px;">
              <li>Next Period Expected: ${data.nextPeriod}</li>
              <li>Ovulation Day: ${data.ovulationDay}</li>
            </ul>
          </div>
        </div>
      `,

      custom: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">${data.title}</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #2c3e50; font-size: 16px;">${data.message}</p>
          </div>
        </div>
      `
    };

    return templates[type] || templates.custom;
  }

  // Send Notifications
  async sendNotification(userEmail, type, data) {
    try {
      const html = this.getEmailTemplate(type, data);
      const subject = this.getSubjectLine(type, data);

      const info = await this.transporter.sendMail({
        from: `"Reproductive Health Timeline" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: subject,
        html: html
      });

      console.log('Notification sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Get Subject Lines
  getSubjectLine(type, data) {
    const subjects = {
      fertilityWindow: 'Upcoming Fertility Window Alert',
      eggCountUpdate: `Egg Count Update - Age ${data.age}`,
      cycleReminder: 'Cycle Reminder and Important Dates',
      custom: data.title
    };

    return subjects[type] || 'Reproductive Health Notification';
  }
}

module.exports = new NotificationSystem(); 