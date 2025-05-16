const sgMail = require('@sendgrid/mail');
const emailConfig = require('../config/emailConfig');

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey || !apiKey.startsWith('SG.')) {
    console.error('Invalid SendGrid API key. Please check your environment variables.');
    process.exit(1);
}

sgMail.setApiKey(apiKey);
console.log('SendGrid initialized with API key');

class EmailService {
    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY;
        if (!this.apiKey) {
            console.error('SendGrid API key is missing');
        }
    }

    async sendCalculatorResults(email, data) {
        if (!email) {
            throw new Error('Email address is required');
        }

        try {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(this.apiKey);

            // Format the data for the email
            const age = data.age || 'Not provided';
            const eggCountInfo = data.eggCountInfo || {};
            const cycleInfo = data.cycleInfo || {};
            const additionalInfo = data.additionalInfo || {};

            // Get product recommendations based on age
            const productRecommendations = this.getProductRecommendations(age);

            const msg = {
                to: email,
                from: 'tobias.felder@gmail.com',
                subject: 'Your Fertility Calculator Results',
                text: `
Your Fertility Calculator Results

Age Information
Current Age: ${age}

Egg Count Range: ${eggCountInfo.current || 'Not applicable'}

Change from 5 years ago: ${eggCountInfo.past || 'Not applicable'}

Projected change in 5 years: ${eggCountInfo.future || 'Not applicable'}

Cycle Information
Next Period: ${cycleInfo.nextPeriod || 'Not provided'}

Ovulation Day: ${cycleInfo.ovulationDay || 'Not provided'}

Fertile Window: ${cycleInfo.fertileWindow || 'Not provided'}

Recommended Products
${productRecommendations.map(p => `${p.name}: ${p.description}`).join('\n')}

This information is provided for educational purposes only and should not be considered medical advice. Please consult with your healthcare provider for personalized medical guidance.
                `,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
                    <h2 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">Your Fertility Calculator Results</h2>
                    
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #34495e; border-bottom: 2px solid #eee; padding-bottom: 10px;">Age Information</h3>
                        <p><strong>Current Age:</strong> ${age}</p>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #34495e; border-bottom: 2px solid #eee; padding-bottom: 10px;">Egg Count Information</h3>
                        <p><strong>Egg Count Range:</strong> ${eggCountInfo.current || 'Not applicable'}</p>
                        <p><strong>Change from 5 years ago:</strong> ${eggCountInfo.past || 'Not applicable'}</p>
                        <p><strong>Projected change in 5 years:</strong> ${eggCountInfo.future || 'Not applicable'}</p>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #34495e; border-bottom: 2px solid #eee; padding-bottom: 10px;">Cycle Information</h3>
                        <p><strong>Next Period:</strong> ${cycleInfo.nextPeriod || 'Not provided'}</p>
                        <p><strong>Ovulation Day:</strong> ${cycleInfo.ovulationDay || 'Not provided'}</p>
                        <p><strong>Fertile Window:</strong> ${cycleInfo.fertileWindow || 'Not provided'}</p>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #34495e; border-bottom: 2px solid #eee; padding-bottom: 10px;">Recommended Products</h3>
                        ${productRecommendations.map(p => `
                            <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                                <h4 style="color: #2c3e50; margin: 0 0 10px 0;">${p.name}</h4>
                                <p style="margin: 0 0 10px 0;">${p.description}</p>
                                <a href="${p.link}" target="_blank" style="display: inline-block; padding: 8px 15px; background-color: #3498db; color: white; text-decoration: none; border-radius: 4px;">Learn More</a>
                            </div>
                        `).join('')}
                    </div>
                    
                    <p style="color: #7f8c8d; font-style: italic; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                        This information is provided for educational purposes only and should not be considered medical advice. Please consult with your healthcare provider for personalized medical guidance.
                    </p>
                </div>
                `
            };

            await sgMail.send(msg);
            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }
    getProductRecommendations(age) {
        const baseProducts = [
            {
                name: "Fertility Tracking App",
                description: "Premium features for cycle tracking.",
                link: "https://www.amazon.com/s?k=fertility+tracking+app&ref=nb_sb_noss_2"
            },
            {
                name: "Fertility-Friendly Tea",
                description: "Herbal tea blend supporting reproductive health.",
                link: "https://www.amazon.com/s?k=fertility+tea&ref=nb_sb_noss_2"
            },
            {
                name: "Ovulation Predictor Kit",
                description: "Easy-to-use kit for tracking ovulation at home.",
                link: "https://www.amazon.com/s?k=ovulation+predictor+kit&ref=nb_sb_noss_2"
            },
            {
                name: "Sperm Donor Search",
                description: "Find a reputable sperm donor clinic near you.",
                link: "https://www.amazon.com/s?k=sperm+donor+clinic&ref=nb_sb_noss_2"
            },
            {
                name: "Fertility Support Supplement",
                description: "A blend of vitamins and minerals to support reproductive health.",
                link: "https://www.amazon.com/s?k=fertility+supplements+for+women&ref=nb_sb_noss_2"
            },
            {
                name: "Menstrual Cup",
                description: "Eco-friendly menstrual cup for comfortable period care.",
                link: "https://www.amazon.com/s?k=menstrual+cup&ref=nb_sb_noss_2"
            }
        ];

        return baseProducts;
    }

    static async sendFertilityUpdate(recipient, data) {
        try {
            const template = emailConfig.templates.fertilityUpdate;
            const text = template.text
                .replace('{name}', recipient.name)
                .replace('{age}', data.age)
                .replace('{eggCount}', data.eggCount)
                .replace('{status}', data.status)
                .replace('{nextSteps}', data.nextSteps.join('\n'));

            const html = template.html
                .replace('{name}', recipient.name)
                .replace('{age}', data.age)
                .replace('{eggCount}', data.eggCount)
                .replace('{status}', data.status)
                .replace('{nextSteps.map(step => `<li>${step}</li>`).join("")}', 
                    data.nextSteps.map(step => `<li>${step}</li>`).join(''));

            const msg = {
                to: recipient.email,
                from: {
                    email: process.env.SENDER_EMAIL || emailConfig.sender.email,
                    name: process.env.SENDER_NAME || emailConfig.sender.name
                },
                subject: template.subject,
                text: text,
                html: html,
                // Add headers to reduce spam filtering
                headers: {
                    'X-SG-EID': 'fertility-wellness-tracker',
                    'X-SG-Category': 'fertility-updates'
                }
            };

            console.log('Sending email with configuration:', {
                to: msg.to,
                from: msg.from,
                subject: msg.subject
            });

            await sgMail.send(msg);
            console.log('Fertility update email sent successfully to:', recipient.email);
        } catch (error) {
            console.error('Error sending fertility update email:', error);
            if (error.response) {
                console.error('SendGrid API Error:', error.response.body);
            }
            throw error;
        }
    }

    static async sendCycleReminder(recipient, data) {
        try {
            const template = emailConfig.templates.cycleReminder;
            const text = template.text
                .replace('{name}', recipient.name)
                .replace('{startDate}', data.startDate)
                .replace('{cycleLength}', data.cycleLength);

            const html = template.html
                .replace('{name}', recipient.name)
                .replace('{startDate}', data.startDate)
                .replace('{cycleLength}', data.cycleLength);

            const msg = {
                to: recipient.email,
                from: {
                    email: process.env.SENDER_EMAIL || emailConfig.sender.email,
                    name: process.env.SENDER_NAME || emailConfig.sender.name
                },
                subject: template.subject,
                text: text,
                html: html,
                // Add headers to reduce spam filtering
                headers: {
                    'X-SG-EID': 'fertility-wellness-tracker',
                    'X-SG-Category': 'cycle-reminders'
                }
            };

            console.log('Sending email with configuration:', {
                to: msg.to,
                from: msg.from,
                subject: msg.subject
            });

            await sgMail.send(msg);
            console.log('Cycle reminder email sent successfully to:', recipient.email);
        } catch (error) {
            console.error('Error sending cycle reminder email:', error);
            if (error.response) {
                console.error('SendGrid API Error:', error.response.body);
            }
            throw error;
        }
    }
}

// Export a singleton instance
module.exports = new EmailService(); 