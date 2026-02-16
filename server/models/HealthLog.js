const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const HealthLog = sequelize.define('HealthLog', {
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
    logDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    systolic: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 300
        }
    },
    diastolic: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 200
        }
    },
    bloodSugar: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
            min: 0,
            max: 999.99
        }
    },
    weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
            min: 0,
            max: 999.99
        }
    },
    heartRate: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 300
        }
    },
    temperature: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        validate: {
            min: 0,
            max: 150
        }
    },
    oxygenLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'health_logs',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Define association
HealthLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(HealthLog, { foreignKey: 'userId', as: 'healthLogs' });

module.exports = HealthLog;
