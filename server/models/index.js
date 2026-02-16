const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const HealthLog = require('./HealthLog');
const Reminder = require('./Reminder');

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established');
    } catch (error) {
        console.error('❌ Unable to connect to database:', error.message);
        throw error;
    }
};

// Initialize database and sync models
const initDatabase = async () => {
    try {
        // Sync all models (create tables if they don't exist)
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Error synchronizing database:', error.message);
        throw error;
    }
};

module.exports = {
    sequelize,
    User,
    HealthLog,
    Reminder,
    testConnection,
    initDatabase
};
