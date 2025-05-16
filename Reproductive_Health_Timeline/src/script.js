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

    console.log('Elements found:', {
        ageInput,
        calculateButton,
        resetButton
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

    function calculateCycleInfo(lastPeriod, cycleLength) {
        console.log('Calculating cycle info:', { lastPeriod, cycleLength });
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
            nextPeriod: nextPeriodDate,
            ovulationDay: ovulationDate,
            fertileWindow: {
                start: fertileStart,
                end: fertileEnd
            }
        };
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

        // Update egg count displays
        eggRangeOutput.textContent = currentRange;
        eggRangeOutputMinus5.textContent = minus5Range;
        eggRangeOutputPlus5.textContent = plus5Range;

        // Update age calculations
        pastAge.textContent = `You were ${age - 5} years old`;
        futureAge.textContent = `You will be ${age + 5} years old`;

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

        // Only calculate cycle information if a last period date is provided
        if (lastPeriod) {
            const cycleInfo = calculateCycleInfo(lastPeriod, cycleLength);
            nextPeriod.textContent = `Next Period: ${formatDate(cycleInfo.nextPeriod)}`;
            ovulationDay.textContent = `Ovulation Day: ${formatDate(cycleInfo.ovulationDay)}`;
            fertileWindow.textContent = `Fertile Window: ${formatDate(cycleInfo.fertileWindow.start)} to ${formatDate(cycleInfo.fertileWindow.end)}`;
        }

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
    
    console.log('Event listeners attached');
}); 