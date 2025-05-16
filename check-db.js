const { sequelize, User, Analytics } = require('./db');

async function checkDatabase() {
    try {
        // Check Users table
        const users = await User.findAll();
        console.log('\nUsers in database:');
        console.log(JSON.stringify(users, null, 2));

        // Check Analytics table
        const analytics = await Analytics.findAll();
        console.log('\nAnalytics entries:');
        console.log(JSON.stringify(analytics, null, 2));
    } catch (error) {
        console.error('Error checking database:', error);
    } finally {
        await sequelize.close();
    }
}

checkDatabase(); 