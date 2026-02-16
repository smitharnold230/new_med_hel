const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Reminder = sequelize.define('Reminder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('medication', 'appointment', 'checkup'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Title is required' }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    time: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Time in HH:MM format (e.g., "09:00")'
    },
    frequency: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'once'),
        allowNull: false,
        defaultValue: 'once'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'reminders',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Define association
Reminder.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Reminder, { foreignKey: 'userId', as: 'reminders' });

module.exports = Reminder;
