const { HealthLog } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create new health log
 * @route   POST /api/health/logs
 * @access  Private
 */
const createHealthLog = async (req, res, next) => {
    try {
        const {
            logDate,
            systolic,
            diastolic,
            bloodSugar,
            weight,
            heartRate,
            temperature,
            oxygenLevel,
            notes
        } = req.body;

        const healthLog = await HealthLog.create({
            userId: req.user.id,
            logDate: logDate || new Date(),
            systolic,
            diastolic,
            bloodSugar,
            weight,
            heartRate,
            temperature,
            oxygenLevel,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Health log created successfully',
            healthLog
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all health logs for user
 * @route   GET /api/health/logs
 * @access  Private
 */
const getHealthLogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, startDate, endDate } = req.query;

        // Build filter
        const where = { userId: req.user.id };

        if (startDate && endDate) {
            where.logDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await HealthLog.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['logDate', 'DESC']],
        });

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            healthLogs: rows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single health log
 * @route   GET /api/health/logs/:id
 * @access  Private
 */
const getHealthLog = async (req, res, next) => {
    try {
        const healthLog = await HealthLog.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!healthLog) {
            return res.status(404).json({
                success: false,
                message: 'Health log not found'
            });
        }

        res.status(200).json({
            success: true,
            healthLog
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update health log
 * @route   PUT /api/health/logs/:id
 * @access  Private
 */
const updateHealthLog = async (req, res, next) => {
    try {
        const healthLog = await HealthLog.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!healthLog) {
            return res.status(404).json({
                success: false,
                message: 'Health log not found'
            });
        }

        const {
            logDate,
            systolic,
            diastolic,
            bloodSugar,
            weight,
            heartRate,
            temperature,
            oxygenLevel,
            notes
        } = req.body;

        // Update fields
        if (logDate) healthLog.logDate = logDate;
        if (systolic !== undefined) healthLog.systolic = systolic;
        if (diastolic !== undefined) healthLog.diastolic = diastolic;
        if (bloodSugar !== undefined) healthLog.bloodSugar = bloodSugar;
        if (weight !== undefined) healthLog.weight = weight;
        if (heartRate !== undefined) healthLog.heartRate = heartRate;
        if (temperature !== undefined) healthLog.temperature = temperature;
        if (oxygenLevel !== undefined) healthLog.oxygenLevel = oxygenLevel;
        if (notes !== undefined) healthLog.notes = notes;

        await healthLog.save();

        res.status(200).json({
            success: true,
            message: 'Health log updated successfully',
            healthLog
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete health log
 * @route   DELETE /api/health/logs/:id
 * @access  Private
 */
const deleteHealthLog = async (req, res, next) => {
    try {
        const healthLog = await HealthLog.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!healthLog) {
            return res.status(404).json({
                success: false,
                message: 'Health log not found'
            });
        }

        await healthLog.destroy();

        res.status(200).json({
            success: true,
            message: 'Health log deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get health statistics
 * @route   GET /api/health/stats
 * @access  Private
 */
const getHealthStats = async (req, res, next) => {
    try {
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const logs = await HealthLog.findAll({
            where: {
                userId: req.user.id,
                logDate: {
                    [Op.gte]: startDate
                }
            },
            order: [['logDate', 'ASC']]
        });

        // Calculate averages
        const stats = {
            totalLogs: logs.length,
            averages: {
                bloodPressure: {
                    systolic: 0,
                    diastolic: 0
                },
                bloodSugar: 0,
                weight: 0,
                heartRate: 0,
                temperature: 0,
                oxygenLevel: 0
            },
            trends: logs.map(log => ({
                date: log.logDate,
                systolic: log.systolic,
                diastolic: log.diastolic,
                bloodSugar: log.bloodSugar,
                weight: log.weight,
                heartRate: log.heartRate
            }))
        };

        // Calculate averages
        if (logs.length > 0) {
            let systolicSum = 0, diastolicSum = 0, sugarSum = 0, weightSum = 0, hrSum = 0, tempSum = 0, o2Sum = 0;
            let systolicCount = 0, diastolicCount = 0, sugarCount = 0, weightCount = 0, hrCount = 0, tempCount = 0, o2Count = 0;

            logs.forEach(log => {
                if (log.systolic) { systolicSum += log.systolic; systolicCount++; }
                if (log.diastolic) { diastolicSum += log.diastolic; diastolicCount++; }
                if (log.bloodSugar) { sugarSum += parseFloat(log.bloodSugar); sugarCount++; }
                if (log.weight) { weightSum += parseFloat(log.weight); weightCount++; }
                if (log.heartRate) { hrSum += log.heartRate; hrCount++; }
                if (log.temperature) { tempSum += parseFloat(log.temperature); tempCount++; }
                if (log.oxygenLevel) { o2Sum += log.oxygenLevel; o2Count++; }
            });

            stats.averages.bloodPressure.systolic = systolicCount > 0 ? Math.round(systolicSum / systolicCount) : 0;
            stats.averages.bloodPressure.diastolic = diastolicCount > 0 ? Math.round(diastolicSum / diastolicCount) : 0;
            stats.averages.bloodSugar = sugarCount > 0 ? (sugarSum / sugarCount).toFixed(2) : 0;
            stats.averages.weight = weightCount > 0 ? (weightSum / weightCount).toFixed(2) : 0;
            stats.averages.heartRate = hrCount > 0 ? Math.round(hrSum / hrCount) : 0;
            stats.averages.temperature = tempCount > 0 ? (tempSum / tempCount).toFixed(2) : 0;
            stats.averages.oxygenLevel = o2Count > 0 ? Math.round(o2Sum / o2Count) : 0;
        }

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createHealthLog,
    getHealthLogs,
    getHealthLog,
    updateHealthLog,
    deleteHealthLog,
    getHealthStats
};
