const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH,
    logging: false
});

// Define User model
const User = sequelize.define('User', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    lastPeriod: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

// Define Analytics model
const Analytics = sequelize.define('Analytics', {
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data: {
        type: Sequelize.JSON,
        allowNull: false
    }
});

// Initialize database
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite database connected successfully');
        
        // Sync all models
        await sequelize.sync();
        console.log('Database models synchronized');
        
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
};

module.exports = {
    sequelize,
    User,
    Analytics,
    initializeDatabase
}; 