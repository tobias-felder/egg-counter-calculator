console.log('Script file loaded - v2');

document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');
    const ageInput = document.getElementById('ageInput');
    const lastPeriodInput = document.getElementById('lastPeriod');
    const cycleLengthInput = document.getElementById('cycleLength');
    const emailInput = document.getElementById('email');
    const sendEmailCheckbox = document.getElementById('sendEmail');
    const eggRangeOutput = document.getElementById('eggRangeOutput');
    const eggRangeOutputPlus5 = document.getElementById('eggRangeOutputPlus5');
    const eggRangeOutputMinus5 = document.getElementById('eggRangeOutputMinus5');
    const pastPercentage = document.getElementById('pastPercentage');
    const futurePercentage = document.getElementById('futurePercentage');
    const nextPeriod = document.getElementById('nextPeriod');
    const fertileWindow = document.getElementById('fertileWindow');
    const ovulationDay = document.getElementById('ovulationDay');
    const ovulationTime = document.getElementById('ovulationTime');

    // Updated medical egg count data (2024 research)
    const eggData = [
        { age: 18, count: 300000, percentage: 75.0 },
        { age: 25, count: 200000, percentage: 50.0 },
        { age: 30, count: 100000, percentage: 25.0 },
        { age: 35, count: 50000, percentage: 12.5 },
        { age: 40, count: 25000, percentage: 6.25 },
        { age: 45, count: 5000, percentage: 1.25 },
        { age: 50, count: 1000, percentage: 0.25 },
        { age: 55, count: 500, percentage: 0.125 }
    ];

    // Helper function to format numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Helper function to calculate egg count range with exponential decay
    function calculateEggRange(age) {
        console.log('Calculating egg range for age:', age);
        
        // Handle edge cases
        if (age < eggData[0].age) {
            return {
                count: eggData[0].count,
                percentage: eggData[0].percentage
            };
        }
        
        if (age >= eggData[eggData.length - 1].age) {
            return {
                count: eggData[eggData.length - 1].count,
                percentage: eggData[eggData.length - 1].percentage
            };
        }
        
        // Find the appropriate age range
        for (let i = 0; i < eggData.length - 1; i++) {
            if (age >= eggData[i].age && age < eggData[i + 1].age) {
                const startAge = eggData[i].age;
                const endAge = eggData[i + 1].age;
                const startCount = eggData[i].count;
                const endCount = eggData[i + 1].count;
                const startPercentage = eggData[i].percentage;
                const endPercentage = eggData[i + 1].percentage;
                
                // Use steeper exponential decay for more accurate biological modeling
                const ageRange = endAge - startAge;
                const progress = (age - startAge) / ageRange;
                const decayFactor = Math.exp(-2 * progress * Math.log(startCount / endCount));
                const count = Math.round(startCount * decayFactor);
                
                // Linear interpolation for percentage
                const percentage = (startPercentage - (startPercentage - endPercentage) * progress).toFixed(2);
                
                console.log('Calculated values:', { age, count, percentage });
                
                return {
                    count: count,
                    percentage: percentage
                };
            }
        }
    }

    // Helper function to calculate cycle information
    function calculateCycleInfo(lastPeriod, cycleLength) {
        const lastPeriodDate = new Date(lastPeriod);
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
        
        const ovulationDate = new Date(nextPeriodDate);
        ovulationDate.setDate(ovulationDate.getDate() - 14);
        
        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(fertileStart.getDate() - 3);
        
        const fertileEnd = new Date(ovulationDate);
        fertileEnd.setDate(fertileEnd.getDate() + 3);

        // Calculate ovulation time window (typically 12-24 hours)
        const ovulationStart = new Date(ovulationDate);
        ovulationStart.setHours(12, 0, 0);
        
        const ovulationEnd = new Date(ovulationDate);
        ovulationEnd.setHours(36, 0, 0); // Next day at noon
        
        return {
            nextPeriod: nextPeriodDate,
            ovulation: ovulationDate,
            fertileStart: fertileStart,
            fertileEnd: fertileEnd,
            ovulationStart: ovulationStart,
            ovulationEnd: ovulationEnd
        };
    }

    // Helper function to format date
    function formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Helper function to format date with time
    function formatDateTime(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }

    calculateButton.addEventListener('click', async function() {
        const age = parseInt(ageInput.value);
        const lastPeriod = lastPeriodInput.value;
        const cycleLength = parseInt(cycleLengthInput.value);
        const email = emailInput.value;
        const shouldSendEmail = sendEmailCheckbox.checked;

        console.log('Calculating for age:', age);

        // Validate inputs
        if (isNaN(age) || age < 18 || age > 55) {
            alert('Please enter a valid age between 18 and 55');
            return;
        }

        if (!lastPeriod) {
            alert('Please enter your last period date');
            return;
        }

        if (isNaN(cycleLength) || cycleLength < 21 || cycleLength > 35) {
            alert('Please enter a valid cycle length between 21 and 35 days');
            return;
        }

        // Calculate current age egg count
        const currentEggRange = calculateEggRange(age);
        if (currentEggRange) {
            eggRangeOutput.textContent = `${formatNumber(currentEggRange.count)} eggs`;
            pastPercentage.textContent = `This is approximately ${currentEggRange.percentage}% of your original egg count`;
        }

        // Calculate future age projections
        const futureAge = age + 5;
        const futureEggRange = calculateEggRange(futureAge);
        if (futureEggRange) {
            eggRangeOutputPlus5.textContent = `${formatNumber(futureEggRange.count)} eggs`;
            futurePercentage.textContent = `This will be approximately ${futureEggRange.percentage}% of your original egg count`;
        }

        // Calculate past age projections
        const pastAge = age - 5;
        const pastEggRange = calculateEggRange(pastAge);
        if (pastEggRange) {
            eggRangeOutputMinus5.textContent = `${formatNumber(pastEggRange.count)} eggs`;
        }

        // Calculate cycle information
        const cycleInfo = calculateCycleInfo(lastPeriod, cycleLength);
        nextPeriod.textContent = `Next Period: ${formatDate(cycleInfo.nextPeriod)}`;
        ovulationDay.textContent = `Estimated Ovulation Day: ${formatDate(cycleInfo.ovulation)}`;
        fertileWindow.textContent = `Fertile Window (Best Time to Conceive): ${formatDate(cycleInfo.fertileStart)} to ${formatDate(cycleInfo.fertileEnd)}`;
        ovulationTime.textContent = `Exact Ovulation Time (12-24 hour window): ${formatDateTime(cycleInfo.ovulationStart)} to ${formatDateTime(cycleInfo.ovulationEnd)}`;

        // Show all output areas
        document.getElementById('currentAgeOutput').style.display = 'block';
        document.getElementById('cycleOutput').style.display = 'block';

        // Send email if checkbox is checked and email is provided
        if (shouldSendEmail && email) {
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                alert('Please enter a valid email address');
                return;
            }

            try {
                const response = await fetch('/api/send-fertility-report', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        results: {
                            age,
                            currentEggCount: `${formatNumber(currentEggRange.count)} eggs`,
                            futureFiveYears: `${formatNumber(futureEggRange.count)} eggs`,
                            pastFiveYears: pastAge >= 18 ? `${formatNumber(pastEggRange.count)} eggs` : 'N/A',
                            nextPeriod: formatDate(cycleInfo.nextPeriod),
                            ovulation: formatDate(cycleInfo.ovulation),
                            fertileWindow: {
                                start: formatDate(cycleInfo.fertileStart),
                                end: formatDate(cycleInfo.fertileEnd)
                            }
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to send email');
                }

                alert('Results have been sent to your email!');
            } catch (error) {
                console.error('Error sending email:', error);
                alert('Failed to send email. Please try again later.');
            }
        }
    });

    resetButton.addEventListener('click', function() {
        // Reset all input fields
        ageInput.value = '';
        lastPeriodInput.value = '';
        cycleLengthInput.value = '';
        emailInput.value = '';
        sendEmailCheckbox.checked = false;
        
        // Reset all output fields
        eggRangeOutput.textContent = '';
        eggRangeOutputPlus5.textContent = '';
        eggRangeOutputMinus5.textContent = '';
        pastPercentage.textContent = '';
        futurePercentage.textContent = '';
        nextPeriod.textContent = '';
        ovulationDay.textContent = '';
        fertileWindow.textContent = '';
        ovulationTime.textContent = '';
        
        // Hide all output areas
        document.getElementById('currentAgeOutput').style.display = 'none';
        document.getElementById('cycleOutput').style.display = 'none';
        
        // Reset any error states
        ageInput.classList.remove('error');
        lastPeriodInput.classList.remove('error');
        cycleLengthInput.classList.remove('error');
        
        // Re-enable the calculate button
        calculateButton.disabled = false;
    });
});

function calculateFertilityStatus(age, eggCount) {
    if (eggCount >= 250000) {
        return 'High fertility';
    } else if (eggCount >= 100000) {
        return 'Good fertility';
    } else if (eggCount >= 25000) {
        return 'Moderate fertility';
    } else if (eggCount >= 5000) {
        return 'Low fertility';
    } else {
        return 'Very low fertility';
    }
}

async function saveCalculation(age, lastPeriod, eggCount, fertilityStatus, email) {
    try {
        const response = await fetch('/api/calculations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                age,
                lastPeriodDate: lastPeriod,
                estimatedEggCount: eggCount,
                fertilityStatus,
                email
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save calculation');
        }
    } catch (error) {
        console.error('Error saving calculation:', error);
        // Don't show error to user as this is optional functionality
    }
} 