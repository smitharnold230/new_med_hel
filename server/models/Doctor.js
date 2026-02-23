const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
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
            notEmpty: { msg: 'Doctor name is required' }
        }
    },
    specialization: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    hospital: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: { msg: 'Please provide a valid email' }
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    nextAppointment: {
        type: DataTypes.DATE,
        allowNull: true
    },
    prescription_file: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'doctors',
    timestamps: true,
    underscored: true
});

module.exports = Doctor;
