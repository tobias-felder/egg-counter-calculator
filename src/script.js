console.log('Script file loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Get all required elements
    const ageInput = document.getElementById('ageInput');
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');
    const eggRangeOutput = document.getElementById('eggRangeOutput');
    const eggRangeOutputMinus5 = document.getElementById('eggRangeOutputMinus5');
    const eggRangeOutputPlus5 = document.getElementById('eggRangeOutputPlus5');
    const pastPercentage = document.getElementById('pastPercentage');
    const futurePercentage = document.getElementById('futurePercentage');
    const pastAge = document.getElementById('pastAge');
    const futureAge = document.getElementById('futureAge');
    const lastPeriodInput = document.getElementById('lastPeriod');
    const cycleLengthInput = document.getElementById('cycleLength');
    const nextPeriod = document.getElementById('nextPeriod');
    const ovulationDay = document.getElementById('ovulationDay');
    const fertileWindow = document.getElementById('fertileWindow');
    const emailInput = document.getElementById('emailInput');
    const sendEmailButton = document.getElementById('sendEmailButton');
    const emailStatus = document.getElementById('emailStatus');
    const fertilityUpdates = document.getElementById('fertilityUpdates');
    const cycleReminders = document.getElementById('cycleReminders');
    const updateFrequency = document.getElementById('updateFrequency');

    console.log('Elements found:', {
        ageInput,
        calculateButton,
        resetButton,
        emailInput,
        sendEmailButton,
        emailStatus,
        fertilityUpdates,
        cycleReminders,
        updateFrequency
    });

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

    // Helper Functions
    function formatNumber(num) {
        return num.toLocaleString();
    }

    function calculateEggRange(age) {
        console.log('Calculating egg range for age:', age);
        for (let i = 0; i < eggData.length; i++) {
            if (age <= eggData[i].age) {
                return eggData[i].range;
            }
        }
        return "0 - 100";
    }

    function calculateCycleInfo() {
        const lastPeriod = document.getElementById('lastPeriod').value;
        const cycleLength = parseInt(document.getElementById('cycleLength').value);
        const periodLength = parseInt(document.getElementById('periodLength').value);

        if (!lastPeriod || !cycleLength || !periodLength) {
            return;
        }

        const lastPeriodDate = new Date(lastPeriod);
        
        // Calculate next period
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
        document.getElementById('nextPeriod').textContent = formatDate(nextPeriodDate);

        // Calculate ovulation day (typically 14 days before next period)
        const ovulationDate = new Date(nextPeriodDate);
        ovulationDate.setDate(ovulationDate.getDate() - 14);
        document.getElementById('ovulationDay').textContent = formatDate(ovulationDate);

        // Calculate fertile window (5 days before ovulation to 1 day after)
        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(fertileStart.getDate() - 5);
        const fertileEnd = new Date(ovulationDate);
        fertileEnd.setDate(fertileEnd.getDate() + 1);
        document.getElementById('fertileWindow').textContent = 
            `${formatDate(fertileStart)} to ${formatDate(fertileEnd)}`;
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    // Main calculation function
    function calculateAllRanges() {
        console.log('Calculate button clicked');
        const age = parseInt(ageInput.value);
        const lastPeriod = lastPeriodInput.value;
        const cycleLength = parseInt(cycleLengthInput.value) || 28;

        console.log('Input values:', { age, lastPeriod, cycleLength });

        if (!age || age < 18 || age > 55) {
            alert('Please enter a valid age between 18 and 55');
            return;
        }

        // Calculate egg ranges
        const currentRange = calculateEggRange(age);
        const plus5Range = calculateEggRange(age + 5);
        const minus5Range = calculateEggRange(age - 5);

        // Update egg count displays with proper formatting
        eggRangeOutput.textContent = `${currentRange} eggs`;
        eggRangeOutputMinus5.textContent = `${minus5Range} eggs`;
        eggRangeOutputPlus5.textContent = `${plus5Range} eggs`;

        // Store the formatted ranges for email
        window.currentEggRange = `Current Age (${age}): ${currentRange} eggs`;
        window.pastEggRange = `5 years ago (Age ${age-5}): ${minus5Range} eggs`;
        window.futureEggRange = `5 years from now (Age ${age+5}): ${plus5Range} eggs`;

        // Calculate and display percentage changes
        const currentEggs = parseInt(currentRange.split(' - ')[0].replace(/,/g, ''));
        const pastEggs = parseInt(minus5Range.split(' - ')[0].replace(/,/g, ''));
        const futureEggs = parseInt(plus5Range.split(' - ')[0].replace(/,/g, ''));

        const pastEggsDecreased = pastEggs - currentEggs;
        const futureEggsDecreased = currentEggs - futureEggs;

        const pastPercentage = ((pastEggsDecreased / pastEggs) * 100).toFixed(1);
        const futurePercentage = ((futureEggsDecreased / currentEggs) * 100).toFixed(1);

        pastPercentage.textContent = `Decreased by ${pastPercentage}% (${formatNumber(pastEggsDecreased)} eggs) from 5 years ago`;
        futurePercentage.textContent = `Projected to decrease by ${futurePercentage}% (${formatNumber(futureEggsDecreased)} eggs) in 5 years`;

        // Calculate cycle information
        calculateCycleInfo();

        console.log('Calculation complete');
    }

    // Reset function
    function resetCalculator() {
        console.log('Reset button clicked');
        ageInput.value = '';
        lastPeriodInput.value = '';
        cycleLengthInput.value = '28';
        
        eggRangeOutput.textContent = '';
        eggRangeOutputMinus5.textContent = '';
        eggRangeOutputPlus5.textContent = '';
        pastPercentage.textContent = '';
        futurePercentage.textContent = '';
        pastAge.textContent = '';
        futureAge.textContent = '';
        nextPeriod.textContent = '';
        ovulationDay.textContent = '';
        fertileWindow.textContent = '';
    }

    // Add event listeners
    calculateButton.addEventListener('click', calculateAllRanges);
    resetButton.addEventListener('click', resetCalculator);
    
    // Add event listeners for cycle calculations
    document.getElementById('lastPeriod').addEventListener('change', calculateCycleInfo);
    document.getElementById('cycleLength').addEventListener('change', calculateCycleInfo);
    document.getElementById('periodLength').addEventListener('change', calculateCycleInfo);
    
    // Send email functionality
    sendEmailButton.addEventListener('click', async function() {
        const email = emailInput.value;
        if (!email) {
            emailStatus.textContent = 'Please enter an email address';
            return;
        }

        // Get all the calculator data
        const age = parseInt(ageInput.value);
        const currentRange = eggRangeOutput.textContent;
        const pastRange = eggRangeOutputMinus5.textContent;
        const futureRange = eggRangeOutputPlus5.textContent;

        // Get cycle information
        const nextPeriod = document.getElementById('nextPeriod').textContent;
        const ovulationDay = document.getElementById('ovulationDay').textContent;
        const fertileWindow = document.getElementById('fertileWindow').textContent;
        const periodLength = document.getElementById('periodLength').value;

        const calculatorData = {
            age: age,
            eggCountInfo: {
                current: `Current Age (${age}): ${currentRange}`,
                past: `5 years ago (Age ${age-5}): ${pastRange}`,
                future: `5 years from now (Age ${age+5}): ${futureRange}`
            },
            cycleInfo: {
                nextPeriod: nextPeriod,
                ovulationDay: ovulationDay,
                fertileWindow: fertileWindow,
                periodLength: periodLength
            },
            additionalInfo: {
                symptoms: document.getElementById('symptoms').value,
                notes: document.getElementById('notes').value
            }
        };

        console.log('Sending email with data:', calculatorData);

        try {
            emailStatus.textContent = 'Sending email...';
            const response = await fetch('/api/send-results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email, 
                    calculatorData,
                    preferences: {
                        fertilityUpdates: fertilityUpdates.checked,
                        cycleReminders: cycleReminders.checked,
                        updateFrequency: updateFrequency.value
                    }
                })
            });

            const result = await response.json();
            if (result.success) {
                emailStatus.textContent = 'Email sent successfully!';
                emailStatus.style.color = 'green';
            } else {
                emailStatus.textContent = 'Error sending email: ' + result.error;
                emailStatus.style.color = 'red';
            }
        } catch (error) {
            emailStatus.textContent = 'Error sending email: ' + error.message;
            emailStatus.style.color = 'red';
        }
    });
    
    console.log('Event listeners attached');
}); 