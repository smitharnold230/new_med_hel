const { Medicine } = require('../models');

/**
 * @desc    Add new medicine
 * @route   POST /api/medicines
 * @access  Private
 */
const addMedicine = async (req, res, next) => {
    try {
        const { name, dosage, frequency, time, instructions, startDate, endDate } = req.body;

        const medicine = await Medicine.create({
            userId: req.user.id,
            name,
            dosage,
            frequency,
            time,
            instructions,
            startDate,
            endDate
        });

        res.status(201).json({
            success: true,
            medicine
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all medicines for user
 * @route   GET /api/medicines
 * @access  Private
 */
const getMedicines = async (req, res, next) => {
    try {
        const medicines = await Medicine.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: medicines.length,
            medicines
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update medicine
 * @route   PUT /api/medicines/:id
 * @access  Private
 */
const updateMedicine = async (req, res, next) => {
    try {
        const medicine = await Medicine.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        await medicine.update(req.body);

        res.json({
            success: true,
            medicine
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete medicine
 * @route   DELETE /api/medicines/:id
 * @access  Private
 */
const deleteMedicine = async (req, res, next) => {
    try {
        const medicine = await Medicine.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        await medicine.destroy();

        res.json({
            success: true,
            message: 'Medicine removed'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addMedicine,
    getMedicines,
    updateMedicine,
    deleteMedicine
};
