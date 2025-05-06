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
                from: 'noreply@reproductivehealthtimeline.com',
                subject: 'Your Fertility Calculator Results',
                text: `
Your Fertility Calculator Results

Age Information
Current Age: ${age}

Egg Count Information
${eggCountInfo.current || 'Not provided'}
${eggCountInfo.past || 'Not provided'}
${eggCountInfo.future || 'Not provided'}

Cycle Information
Next Period: ${cycleInfo.nextPeriod || 'Not provided'}
Ovulation Day: ${cycleInfo.ovulationDay || 'Not provided'}
Fertile Window: ${cycleInfo.fertileWindow || 'Not provided'}
Period Length: ${cycleInfo.periodLength || 'Not provided'} days

Additional Information
Symptoms: ${additionalInfo.symptoms || 'Not provided'}
Notes: ${additionalInfo.notes || 'Not provided'}

Recommended Products
${productRecommendations.map(p => `${p.name}: ${p.description}\n${p.link}`).join('\n\n')}

This information is provided for educational purposes only and should not be considered medical advice. Please consult with your healthcare provider for personalized medical guidance.
                `,
                html: `
                    <h2>Your Fertility Calculator Results</h2>
                    
                    <h3>Age Information</h3>
                    <p><strong>Current Age:</strong> ${age}</p>
                    
                    <h3>Egg Count Information</h3>
                    <p><strong>${eggCountInfo.current || 'Not provided'}</strong></p>
                    <p><strong>${eggCountInfo.past || 'Not provided'}</strong></p>
                    <p><strong>${eggCountInfo.future || 'Not provided'}</strong></p>
                    
                    <h3>Cycle Information</h3>
                    <p><strong>Next Period:</strong> ${cycleInfo.nextPeriod || 'Not provided'}</p>
                    <p><strong>Ovulation Day:</strong> ${cycleInfo.ovulationDay || 'Not provided'}</p>
                    <p><strong>Fertile Window:</strong> ${cycleInfo.fertileWindow || 'Not provided'}</p>
                    <p><strong>Period Length:</strong> ${cycleInfo.periodLength || 'Not provided'} days</p>
                    
                    <h3>Additional Information</h3>
                    <p><strong>Symptoms:</strong> ${additionalInfo.symptoms || 'Not provided'}</p>
                    <p><strong>Notes:</strong> ${additionalInfo.notes || 'Not provided'}</p>

                    <h3>Recommended Products</h3>
                    ${productRecommendations.map(p => `
                        <div class="product-recommendation">
                            <h4>${p.name}</h4>
                            <p>${p.description}</p>
                            <a href="${p.link}" target="_blank" class="product-link">Learn More</a>
                        </div>
                    `).join('')}
                    
                    <p><em>This information is provided for educational purposes only and should not be considered medical advice. Please consult with your healthcare provider for personalized medical guidance.</em></p>
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
        // Product recommendations based on age and fertility status
        const baseProducts = [
            {
                name: "Fertility Support Supplement",
                description: "A comprehensive blend of vitamins and minerals to support reproductive health.",
                link: "https://your-affiliate-link.com/fertility-supplement"
            },
            {
                name: "Fertility Awareness Book",
                description: "Learn about your body's natural fertility signs and cycles.",
                link: "https://your-affiliate-link.com/fertility-book"
            }
        ];

        if (age >= 35) {
            baseProducts.push({
                name: "Advanced Fertility Support",
                description: "Specialized supplements designed for women over 35.",
                link: "https://your-affiliate-link.com/advanced-fertility"
            });
        }

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