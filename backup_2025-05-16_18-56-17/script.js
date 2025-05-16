console.log('Script file loaded - v3');

document.addEventListener('DOMContentLoaded', function() {
    // Get all required elements
    const ageInput = document.getElementById('ageInput');
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');
    const lastPeriodInput = document.getElementById('lastPeriod');
    const cycleLengthInput = document.getElementById('cycleLength');
    const periodLengthInput = document.getElementById('periodLength');
    const nextPeriod = document.getElementById('nextPeriod');
    const ovulationDay = document.getElementById('ovulationDay');
    const fertileWindow = document.getElementById('fertileWindow');
    const emailInput = document.getElementById('emailInput');
    const sendEmailButton = document.getElementById('sendEmailButton');
    const emailStatus = document.getElementById('emailStatus');
    const eggRangeOutput = document.getElementById('eggRangeOutput');
    const eggRangeOutputMinus5 = document.getElementById('eggRangeOutputMinus5');
    const eggRangeOutputPlus5 = document.getElementById('eggRangeOutputPlus5');
    const pastPercentage = document.getElementById('pastPercentage');
    const futurePercentage = document.getElementById('futurePercentage');
    const fertilityUpdates = document.getElementById('fertilityUpdates');
    const cycleReminders = document.getElementById('cycleReminders');
    const updateFrequency = document.getElementById('updateFrequency');
    const saveEntryButton = document.getElementById('saveEntryButton');

    // Egg count data
    const eggData = [
        { age: 18, range: "100,000 - 200,000" },
        { age: 25, range: "100,000 - 150,000" },
        { age: 30, range: "50,000 - 100,000" },
        { age: 35, range: "25,000 - 50,000" },
        { age: 40, range: "10,000 - 25,000" },
        { age: 45, range: "1,000 - 10,000" },
        { age: 50, range: "100 - 1,000" },
        { age: 55, range: "0 - 100" }
    ];

    // Helper function to format dates
    function formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    // Helper function to format numbers
    function formatNumber(num) {
        return num.toLocaleString();
    }

    // Calculate egg range based on age
    function calculateEggRange(age) {
        for (let i = 0; i < eggData.length; i++) {
            if (age <= eggData[i].age) {
                return eggData[i].range;
            }
        }
        return "0 - 100";
    }

    // Calculate cycle information
    function calculateCycleInfo() {
        if (!lastPeriodInput || !cycleLengthInput || !periodLengthInput) {
            console.error('Required input elements not found');
            return;
        }

        const lastPeriod = lastPeriodInput.value;
        const cycleLength = parseInt(cycleLengthInput.value) || 28;
        const periodLength = parseInt(periodLengthInput.value) || 5;

        if (!lastPeriod) {
            console.log('No last period date provided');
            return;
        }

        const lastPeriodDate = new Date(lastPeriod);
        
        // Calculate next period
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
        nextPeriod.textContent = formatDate(nextPeriodDate);

        // Calculate ovulation day (typically 14 days before next period)
        const ovulationDate = new Date(nextPeriodDate);
        ovulationDate.setDate(ovulationDate.getDate() - 14);
        ovulationDay.textContent = formatDate(ovulationDate);

        // Calculate fertile window (5 days before ovulation to 1 day after)
        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(fertileStart.getDate() - 5);
        const fertileEnd = new Date(ovulationDate);
        fertileEnd.setDate(fertileEnd.getDate() + 1);
        fertileWindow.textContent = `${formatDate(fertileStart)} to ${formatDate(fertileEnd)}`;

        console.log('Cycle calculations complete:', {
            nextPeriod: nextPeriod.textContent,
            ovulationDay: ovulationDay.textContent,
            fertileWindow: fertileWindow.textContent
        });
    }

    // Main calculation function
    function calculateAllRanges() {
        console.log('Calculate button clicked');
        
        if (!ageInput || !lastPeriodInput || !cycleLengthInput) {
            console.error('Required input elements not found');
            return;
        }

        const age = parseInt(ageInput.value);
        const lastPeriod = lastPeriodInput.value;
        const cycleLength = parseInt(cycleLengthInput.value) || 28;

        if (!age || age < 18 || age > 55) {
            alert('Please enter a valid age between 18 and 55');
            return;
        }

        // Calculate egg ranges
        const currentRange = calculateEggRange(age);
        const plus5Range = calculateEggRange(age + 5);
        const minus5Range = calculateEggRange(age - 5);

        // Update egg count displays
        eggRangeOutput.textContent = `Current Age (${age}): ${currentRange} eggs`;
        eggRangeOutputMinus5.textContent = `5 years ago (Age ${age-5}): ${minus5Range} eggs`;
        eggRangeOutputPlus5.textContent = `5 years from now (Age ${age+5}): ${plus5Range} eggs`;

        // Parse numbers correctly by removing commas first
        const currentEggs = parseInt(currentRange.split(' - ')[0].replace(/,/g, ''));
        const pastEggs = parseInt(minus5Range.split(' - ')[0].replace(/,/g, ''));
        const futureEggs = parseInt(plus5Range.split(' - ')[0].replace(/,/g, ''));

        if (!isNaN(currentEggs) && !isNaN(pastEggs) && !isNaN(futureEggs)) {
            const pastEggsDecreased = pastEggs - currentEggs;
            const futureEggsDecreased = currentEggs - futureEggs;

            const pastPercentageValue = ((pastEggsDecreased / pastEggs) * 100).toFixed(1);
            const futurePercentageValue = ((futureEggsDecreased / currentEggs) * 100).toFixed(1);

            pastPercentage.textContent = `Decreased by ${pastPercentageValue}% (${formatNumber(pastEggsDecreased)} eggs) from 5 years ago`;
            futurePercentage.textContent = `Projected to decrease by ${futurePercentageValue}% (${formatNumber(futureEggsDecreased)} eggs) in 5 years`;
        } else {
            pastPercentage.textContent = 'Unable to calculate percentage change';
            futurePercentage.textContent = 'Unable to calculate percentage change';
        }

        // Calculate cycle information
        calculateCycleInfo();
    }

    // Reset function
    function resetCalculator() {
        ageInput.value = '';
        lastPeriodInput.value = '';
        cycleLengthInput.value = '28';
        periodLengthInput.value = '5';
        nextPeriod.textContent = '-';
        ovulationDay.textContent = '-';
        fertileWindow.textContent = '-';
        eggRangeOutput.textContent = '';
        eggRangeOutputMinus5.textContent = '';
        eggRangeOutputPlus5.textContent = '';
        pastPercentage.textContent = '';
        futurePercentage.textContent = '';
    }

    // Save entry functionality
    if (saveEntryButton) {
        saveEntryButton.addEventListener('click', function() {
            const entryData = {
                lastPeriod: lastPeriodInput.value,
                cycleLength: cycleLengthInput.value,
                periodLength: periodLengthInput.value,
                previousPregnancies: document.getElementById('previousPregnancies').value,
                previousSurgeries: document.getElementById('previousSurgeries').value,
                symptoms: document.getElementById('symptoms').value,
                notes: document.getElementById('notes').value
            };

            // Save to localStorage
            localStorage.setItem('lastEntry', JSON.stringify(entryData));
            alert('Entry saved successfully!');
        });
    }

    // Load saved entry if exists
    const savedEntry = localStorage.getItem('lastEntry');
    if (savedEntry) {
        const entryData = JSON.parse(savedEntry);
        lastPeriodInput.value = entryData.lastPeriod;
        cycleLengthInput.value = entryData.cycleLength;
        periodLengthInput.value = entryData.periodLength;
        document.getElementById('previousPregnancies').value = entryData.previousPregnancies;
        document.getElementById('previousSurgeries').value = entryData.previousSurgeries;
        document.getElementById('symptoms').value = entryData.symptoms;
        document.getElementById('notes').value = entryData.notes;
    }

    // Email preferences
    const savedPreferences = localStorage.getItem('emailPreferences');
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        emailInput.value = preferences.email;
        fertilityUpdates.checked = preferences.fertilityUpdates;
        cycleReminders.checked = preferences.cycleReminders;
        updateFrequency.value = preferences.updateFrequency;
    }

    // Save email preferences
    function saveEmailPreferences() {
        const preferences = {
            email: emailInput.value,
            fertilityUpdates: fertilityUpdates.checked,
            cycleReminders: cycleReminders.checked,
            updateFrequency: updateFrequency.value
        };
        localStorage.setItem('emailPreferences', JSON.stringify(preferences));
    }

    if (emailInput) emailInput.addEventListener('change', saveEmailPreferences);
    if (fertilityUpdates) fertilityUpdates.addEventListener('change', saveEmailPreferences);
    if (cycleReminders) cycleReminders.addEventListener('change', saveEmailPreferences);
    if (updateFrequency) updateFrequency.addEventListener('change', saveEmailPreferences);

    // Send email functionality
if (sendEmailButton) {
    sendEmailButton.addEventListener('click', async function() {
        const email = emailInput.value;
        if (!email) {
            emailStatus.textContent = 'Please enter an email address';
            return;
        }

        // Check if we have all required data
        if (!ageInput.value || !eggRangeOutput.textContent) {
            emailStatus.textContent = 'Please calculate your results first';
            return;
        }

        // Get all the calculator data
const calculatorData = {
    age: ageInput.value,
    eggCountInfo: {
        current: eggRangeOutput.textContent || '',
        past: eggRangeOutputMinus5.textContent || '',
        future: eggRangeOutputPlus5.textContent || ''
    },
    cycleInfo: {
        nextPeriod: nextPeriod.textContent || '',
        ovulationDay: ovulationDay.textContent || '',
        fertileWindow: fertileWindow.textContent || '',
        periodLength: periodLengthInput.value || ''
    },
    subscriptionInfo: {
        fertilityUpdates: fertilityUpdates.checked,
        cycleReminders: cycleReminders.checked,
        updateFrequency: updateFrequency.value,
        currentPlan: document.getElementById('currentPlan').textContent || 'Free',
        availableFeatures: document.getElementById('availableFeatures').textContent || 'Basic Calculator',
        nextBillingDate: document.getElementById('nextBillingDate').textContent || 'N/A'
    }
};

        // Debug log
        console.log('Sending data:', calculatorData);

        try {
            emailStatus.textContent = 'Sending email...';
            const response = await fetch('http://localhost:3000/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email, 
                    calculatorData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                emailStatus.textContent = 'Email sent successfully!';
                emailStatus.style.color = 'green';
            } else {
                emailStatus.textContent = 'Error sending email: ' + result.error;
                emailStatus.style.color = 'red';
            }
        } catch (error) {
            console.error('Full error:', error);
            emailStatus.textContent = 'Error sending email: ' + error.message;
            emailStatus.style.color = 'red';
        }
    });
}

    // Add event listeners
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateAllRanges);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetCalculator);
    }
    
    // Add event listeners for cycle calculations
    if (lastPeriodInput) {
        lastPeriodInput.addEventListener('change', calculateCycleInfo);
    }
    if (cycleLengthInput) {
        cycleLengthInput.addEventListener('change', calculateCycleInfo);
    }
    if (periodLengthInput) {
        periodLengthInput.addEventListener('change', calculateCycleInfo);
    }
});