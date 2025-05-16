const API_BASE_URL = 'http://localhost:3000/api';
const USER_ID = 'JA9pk2XHsPhNC1cYtxXhOMWPEJy2'; // Replace with actual user ID

// DOM Elements
const userInfo = document.getElementById('userInfo');
const trackingList = document.getElementById('trackingList');
const trackingForm = document.getElementById('trackingForm');
const subscriptionInfo = document.getElementById('subscriptionInfo');

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
}

function showNewTrackingForm() {
    trackingForm.classList.remove('hidden');
}

function hideTrackingForm() {
    trackingForm.classList.add('hidden');
}

// API Functions
async function fetchUserInfo() {
    try {
        // Sample user data for demonstration
        const user = {
            name: "Sample User",
            email: "sample@example.com",
            age: 30
        };
        
        userInfo.innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Age:</strong> ${user.age}</p>
        `;
    } catch (error) {
        userInfo.innerHTML = '<p class="text-danger">Error loading user information</p>';
    }
}

async function fetchTrackingEntries() {
    try {
        // Sample tracking data for demonstration
        const entries = [
            {
                cycleStartDate: new Date().toISOString(),
                cycleLength: 28,
                periodLength: 5,
                symptoms: ['cramps', 'headache'],
                notes: 'Regular cycle'
            }
        ];
        
        if (entries.length === 0) {
            trackingList.innerHTML = '<p>No tracking entries found</p>';
            return;
        }

        trackingList.innerHTML = entries.map(entry => `
            <div class="card mb-3">
                <div class="card-body">
                    <h6 class="card-title">Cycle starting ${formatDate(entry.cycleStartDate)}</h6>
                    <p class="card-text">
                        <strong>Cycle Length:</strong> ${entry.cycleLength} days<br>
                        <strong>Period Length:</strong> ${entry.periodLength} days<br>
                        <strong>Symptoms:</strong> ${entry.symptoms?.join(', ') || 'None'}<br>
                        <strong>Notes:</strong> ${entry.notes || 'None'}
                    </p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        trackingList.innerHTML = '<p class="text-danger">Error loading tracking entries</p>';
    }
}

async function fetchSubscriptionInfo() {
    try {
        // Sample subscription data for demonstration
        const subscription = {
            plan: "premium",
            status: "active",
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        };
        
        subscriptionInfo.innerHTML = `
            <p><strong>Plan:</strong> ${subscription.plan}</p>
            <p><strong>Status:</strong> ${subscription.status}</p>
            <p><strong>Start Date:</strong> ${formatDate(subscription.startDate)}</p>
            <p><strong>End Date:</strong> ${formatDate(subscription.endDate)}</p>
        `;
    } catch (error) {
        subscriptionInfo.innerHTML = '<p class="text-danger">Error loading subscription information</p>';
    }
}

// Initialize the application
console.log('Main script loaded');

// Store the last entered fertility data
let lastFertilityData = null;

// Function to calculate egg count based on age
function calculateEggCount(age) {
    console.log('Calculating egg count for age:', age);
    // This is a simplified calculation for demonstration
    const baseCount = 1000000; // Starting egg count
    const declineRate = 0.1; // 10% decline per year after 30
    let eggCount;

    if (age <= 30) {
        eggCount = baseCount * (1 - (age * 0.01)); // 1% decline per year until 30
    } else {
        const yearsOver30 = age - 30;
        eggCount = baseCount * 0.7 * Math.pow(1 - declineRate, yearsOver30);
    }

    return Math.round(eggCount).toLocaleString(); // Format with commas
}

// Function to create a tracking entry
async function createTrackingEntry(formData) {
    try {
        const response = await fetch('/api/tracking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to save tracking entry');
        }

        const result = await response.json();
        if (result.success) {
            // Store the data for email sending
            lastFertilityData = formData;
            alert('Tracking entry saved successfully!');
        } else {
            throw new Error(result.error || 'Failed to save tracking entry');
        }
    } catch (error) {
        console.error('Error creating tracking entry:', error);
        alert('Error creating tracking entry: ' + error.message);
    }
}

// Function to send test email
async function sendTestEmail(email) {
    try {
        if (!lastFertilityData) {
            throw new Error('Please save your tracking entry first');
        }

        const response = await fetch('/api/test-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                fertilityData: lastFertilityData
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send test email');
        }

        const result = await response.json();
        if (result.success) {
            alert('Test email sent successfully!');
        } else {
            throw new Error(result.error || 'Failed to send test email');
        }
    } catch (error) {
        console.error('Error sending test email:', error);
        alert('Error sending test email: ' + error.message);
    }
}

// Function to calculate fertile days
function calculateFertileDays() {
    console.log('Calculating fertile days');
    const startDate = document.getElementById('lastPeriod').value;
    const cycleLength = parseInt(document.getElementById('cycleLength').value);
    
    console.log('Start date:', startDate);
    console.log('Cycle length:', cycleLength);
    
    if (!startDate || !cycleLength) {
        console.log('Missing start date or cycle length');
        return;
    }

    const fertileWindow = document.getElementById('fertileWindow');
    const ovulationDay = document.getElementById('ovulationDay');
    const nextPeriod = document.getElementById('nextPeriod');

    console.log('Found elements:', {
        fertileWindow: !!fertileWindow,
        ovulationDay: !!ovulationDay,
        nextPeriod: !!nextPeriod
    });

    // Calculate ovulation day (typically 14 days before next period)
    const ovulationDayNum = cycleLength - 14;
    
    // Fertile window is typically 5 days before ovulation and 1 day after
    const fertileStart = ovulationDayNum - 5;
    const fertileEnd = ovulationDayNum + 1;

    const startDateObj = new Date(startDate);
    const fertileStartDate = new Date(startDateObj);
    fertileStartDate.setDate(startDateObj.getDate() + fertileStart);
    
    const fertileEndDate = new Date(startDateObj);
    fertileEndDate.setDate(startDateObj.getDate() + fertileEnd);

    const nextPeriodDate = new Date(startDateObj);
    nextPeriodDate.setDate(startDateObj.getDate() + cycleLength);

    const ovulationDate = new Date(startDateObj);
    ovulationDate.setDate(startDateObj.getDate() + ovulationDayNum);

    console.log('Setting fertile window:', fertileStartDate.toLocaleDateString(), '-', fertileEndDate.toLocaleDateString());
    fertileWindow.textContent = `Fertile Window: ${fertileStartDate.toLocaleDateString()} - ${fertileEndDate.toLocaleDateString()}`;
    ovulationDay.textContent = `Expected Ovulation: ${ovulationDate.toLocaleDateString()}`;
    nextPeriod.textContent = `Next Period: ${nextPeriodDate.toLocaleDateString()}`;
}

// Function to update all calculations
function updateAllCalculations() {
    console.log('Updating all calculations');
    const age = parseInt(document.getElementById('ageInput').value);
    console.log('Age input:', age);
    
    if (age >= 18 && age <= 60) {
        const eggCount = calculateEggCount(age);
        const eggRangeOutput = document.getElementById('eggRangeOutput');
        const eggRangeOutputMinus5 = document.getElementById('eggRangeOutputMinus5');
        const eggRangeOutputPlus5 = document.getElementById('eggRangeOutputPlus5');

        console.log('Found egg count elements:', {
            eggRangeOutput: !!eggRangeOutput,
            eggRangeOutputMinus5: !!eggRangeOutputMinus5,
            eggRangeOutputPlus5: !!eggRangeOutputPlus5
        });

        console.log('Setting egg count outputs');
        eggRangeOutput.textContent = `Current Age (${age}): ${eggCount} eggs`;
        eggRangeOutputMinus5.textContent = `Age ${age-5}: ${calculateEggCount(age-5)} eggs`;
        eggRangeOutputPlus5.textContent = `Age ${age+5}: ${calculateEggCount(age+5)} eggs`;
    }
    calculateFertileDays();
}

// Email Preferences
document.getElementById('savePreferences').addEventListener('click', async () => {
    const email = document.getElementById('userEmailInput').value;
    if (!email) {
        alert('Please enter your email address');
        return;
    }

    const preferences = {
        email: email,
        fertilityUpdates: document.getElementById('fertilityUpdates').checked,
        cycleReminders: document.getElementById('cycleReminders').checked,
        frequency: document.getElementById('notificationFrequency').value
    };

    try {
        // In a real application, you would save these preferences to your backend
        console.log('Saving preferences:', preferences);
        alert('Email preferences saved successfully!');
    } catch (error) {
        console.error('Error saving preferences:', error);
        alert('Failed to save preferences. Please try again.');
    }
});

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Calculate button functionality
    const calculateButton = document.getElementById('calculateButton');
    console.log('Calculate button:', calculateButton);
    if (calculateButton) {
        calculateButton.addEventListener('click', updateAllCalculations);
    } else {
        console.error('Calculate button not found!');
    }

    // Calculate egg count when age changes
    const ageInput = document.getElementById('ageInput');
    console.log('Age input:', ageInput);
    if (ageInput) {
        ageInput.addEventListener('input', (e) => {
            const age = parseInt(e.target.value);
            console.log('Age input changed:', age);
            if (age >= 18 && age <= 60) {
                const eggCount = calculateEggCount(age);
                const eggRangeOutput = document.getElementById('eggRangeOutput');
                const eggRangeOutputMinus5 = document.getElementById('eggRangeOutputMinus5');
                const eggRangeOutputPlus5 = document.getElementById('eggRangeOutputPlus5');

                eggRangeOutput.textContent = `Current Age (${age}): ${eggCount} eggs`;
                eggRangeOutputMinus5.textContent = `Age ${age-5}: ${calculateEggCount(age-5)} eggs`;
                eggRangeOutputPlus5.textContent = `Age ${age+5}: ${calculateEggCount(age+5)} eggs`;
            }
        });
    } else {
        console.error('Age input not found!');
    }

    // Calculate fertile days when cycle information changes
    const lastPeriod = document.getElementById('lastPeriod');
    const cycleLength = document.getElementById('cycleLength');
    console.log('Cycle inputs:', {
        lastPeriod: !!lastPeriod,
        cycleLength: !!cycleLength
    });
    
    if (lastPeriod) {
        lastPeriod.addEventListener('change', calculateFertileDays);
    } else {
        console.error('Last period input not found!');
    }
    
    if (cycleLength) {
        cycleLength.addEventListener('input', calculateFertileDays);
    } else {
        console.error('Cycle length input not found!');
    }

    // Reset button functionality
    const resetButton = document.getElementById('resetButton');
    console.log('Reset button:', resetButton);
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            document.getElementById('ageInput').value = '';
            document.getElementById('lastPeriod').value = '';
            document.getElementById('cycleLength').value = '';
            document.getElementById('eggRangeOutput').textContent = '';
            document.getElementById('eggRangeOutputMinus5').textContent = '';
            document.getElementById('eggRangeOutputPlus5').textContent = '';
            document.getElementById('fertileWindow').textContent = '';
            document.getElementById('ovulationDay').textContent = '';
            document.getElementById('nextPeriod').textContent = '';
        });
    } else {
        console.error('Reset button not found!');
    }

    fetchUserInfo();
    fetchTrackingEntries();
    fetchSubscriptionInfo();
}); 