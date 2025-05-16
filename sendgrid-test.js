const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper function to format dates
function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Calculate cycle information
function calculateCycleInfo(lastPeriod, cycleLength = 28) {
    const lastPeriodDate = new Date(lastPeriod);
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
    
    const ovulationDate = new Date(lastPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14));
    
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    return {
        nextPeriod: formatDate(nextPeriodDate),
        ovulationDay: formatDate(ovulationDate),
        fertileWindow: `${formatDate(fertileStart)} to ${formatDate(fertileEnd)}`
    };
}

async function testEmail() {
    try {
        console.log('Testing email service...');
        
        // Calculate cycle information based on last period
        const lastPeriod = '2024-04-23'; // Example date
        const cycleInfo = calculateCycleInfo(lastPeriod);
        
        // This is the data that would come from your calculator
        const calculatorData = {
            age: 46,
            eggCountInfo: {
                current: "Current Age (46): 1,000 - 10,000 eggs",
                past: "5 years ago (Age 41): 10,000 - 25,000 eggs",
                future: "5 years from now (Age 51): 100 - 1,000 eggs"
            },
            cycleInfo: cycleInfo
        };

        const msg = {
            to: 'tobias.felder@gmail.com',
            from: 'tobias.felder@gmail.com',
            subject: 'Your Fertility Calculator Results',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2c3e50; text-align: center;">Your Fertility Calculator Results</h1>
                    
                    <div style="margin: 20px 0;">
                        <h2 style="color: #34495e;">Age Information</h2>
                        <p><strong>Current Age:</strong> ${calculatorData.age}</p>
                        <p><strong>Egg Count Range:</strong> ${calculatorData.eggCountInfo.current}</p>
                        <p><strong>Change from 5 years ago:</strong> ${calculatorData.eggCountInfo.past}</p>
                        <p><strong>Projected change in 5 years:</strong> ${calculatorData.eggCountInfo.future}</p>
                    </div>

                    <div style="margin: 20px 0;">
                        <h2 style="color: #34495e;">Cycle Information</h2>
                        <p><strong>Next Period:</strong> ${calculatorData.cycleInfo.nextPeriod}</p>
                        <p><strong>Ovulation Day:</strong> ${calculatorData.cycleInfo.ovulationDay}</p>
                        <p><strong>Fertile Window:</strong> ${calculatorData.cycleInfo.fertileWindow}</p>
                    </div>
                </div>
            `
        };

        console.log('Attempting to send test email...');
        const response = await sgMail.send(msg);
        console.log('Test email sent successfully!');
        console.log('Response:', response);
    } catch (error) {
        console.error('Error sending test email:', error.response ? error.response.body : error.message);
    }
}

testEmail();