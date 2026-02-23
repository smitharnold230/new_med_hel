const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Medicine = sequelize.define('Medicine', {
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
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Medicine name is required' }
        }
    },
    dosage: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'e.g., 500mg, 1 tablet'
    },
    frequency: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Daily',
        comment: 'Daily, Weekly, As needed'
    },
    time: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: '24h format HH:mm, e.g., 08:00'
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'e.g., Take after food'
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'medicines',
    timestamps: true,
    underscored: true
});

module.exports = Medicine;
