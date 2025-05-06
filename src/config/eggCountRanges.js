// Egg count ranges configuration
// These ranges are based on medical research and can be easily updated
// without changing the core functionality

const eggCountConfig = {
    // Age ranges and their corresponding egg count estimates
    ranges: {
        '13-20': { 
            min: 300000, 
            max: 400000,
            description: 'Peak reproductive years with highest egg count'
        },
        '21-25': { 
            min: 200000, 
            max: 300000,
            description: 'High fertility with gradual decline beginning'
        },
        '26-30': { 
            min: 150000, 
            max: 250000,
            description: 'Good fertility with moderate decline'
        },
        '31-35': { 
            min: 100000, 
            max: 150000,
            description: 'Fertility begins to decline more noticeably'
        },
        '36-40': { 
            min: 50000, 
            max: 100000,
            description: 'Significant decline in fertility'
        },
        '41-45': { 
            min: 10000, 
            max: 50000,
            description: 'Advanced decline in fertility'
        },
        '46-55': { 
            min: 1000, 
            max: 10000,
            description: 'Natural decline approaching menopause'
        }
    },

    // Adjustments for other factors
    adjustments: {
        pregnancy: {
            reductionPerPregnancy: 1000,
            description: 'Each pregnancy reduces egg count by approximately 1000 eggs'
        },
        surgery: {
            ovarian: {
                reduction: 0.7, // 30% reduction
                description: 'Ovarian surgery reduces egg count by approximately 30%'
            },
            other: {
                reduction: 0.9, // 10% reduction
                description: 'Other reproductive surgeries reduce egg count by approximately 10%'
            }
        }
    },

    // Age limits for the calculator
    ageLimits: {
        min: 13,
        max: 55,
        description: 'Calculator is designed for ages 13-55'
    },

    // Future projection settings
    projections: {
        yearsBefore: 5,
        yearsAfter: 5,
        interval: 5, // Show projections every 5 years
        description: 'Shows projections for 5 years before and after current age'
    }
};

module.exports = eggCountConfig; 