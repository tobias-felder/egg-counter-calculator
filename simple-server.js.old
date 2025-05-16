const express = require('express');
const path = require('path');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const clinicDirectory = require('./directory/directory');

// --- Affiliate Product Setup ---
const productDatabase = [
    {
      name: "Prenatal Vitamin",
      description: "Comprehensive prenatal vitamin with folic acid and DHA.",
      affiliateLink: "https://amazon.com/affiliate-link-1",
      ageRange: [18, 45],
      category: "supplements"
    },
    {
      name: "Fertility Tracking App",
      description: "Premium features for cycle tracking.",
      affiliateLink: "https://app-store-link",
      ageRange: [18, 55],
      category: "apps"
    },
    {
      name: "Fertility-Friendly Tea",
      description: "Herbal tea blend supporting reproductive health.",
      affiliateLink: "https://amazon.com/affiliate-link-2",
      ageRange: [18, 55],
      category: "wellness"
    },
    {
      name: "Ovulation Predictor Kit",
      description: "Easy-to-use kit for tracking ovulation at home.",
      affiliateLink: "https://amazon.com/affiliate-link-3",
      ageRange: [18, 50],
      category: "testing"
    },
    {
      name: "Egg Freezing Consultation",
      description: "Book a consultation with a top-rated egg freezing clinic.",
      affiliateLink: "https://eggfreezingclinic.com/affiliate-link",
      ageRange: [25, 45],
      category: "services"
    },
    {
      name: "Sperm Donor Search",
      description: "Find a reputable sperm donor clinic near you.",
      affiliateLink: "https://spermdonorclinic.com/affiliate-link",
      ageRange: [18, 55],
      category: "services"
    },
    {
      name: "Fertility Support Supplement",
      description: "A blend of vitamins and minerals to support reproductive health.",
      affiliateLink: "https://amazon.com/affiliate-link-4",
      ageRange: [18, 50],
      category: "supplements"
    },
    {
      name: "Menstrual Cup",
      description: "Eco-friendly menstrual cup for comfortable period care.",
      affiliateLink: "https://amazon.com/affiliate-link-5",
      ageRange: [18, 50],
      category: "wellness"
    }
    // Add more as needed!
  ];

function getRecommendedProducts(age) {
  return productDatabase.filter(
    p => age >= p.ageRange[0] && age <= p.ageRange[1]
  );
}
// --- End Affiliate Product Setup ---

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(clinicDirectory); 

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
    try {
        const { email, age, eggCountInfo, cycleInfo } = req.body;

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
            subject: 'Your Fertility Calculator Results',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2c3e50; text-align: center;">Your Fertility Calculator Results</h1>
                    
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

                    ${productSection}
                </div>
            `
        };

        await sgMail.send(msg);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: error.message });
    }
});

app.use(express.static(path.join(__dirname, 'src')));

app.get('/calculator', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Calculator available at http://localhost:${PORT}/calculator`);
});