const { Doctor, Prescription } = require('../models');

/**
 * @desc    Create a new doctor
 * @route   POST /api/doctors
 * @access  Private
 */
const createDoctor = async (req, res, next) => {
    try {
        const { name, specialization, hospital, phone, email, address, notes } = req.body;

        const doctor = await Doctor.create({
            userId: req.user.id,
            name,
            specialization,
            hospital,
            phone,
            email,
            address,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Doctor added successfully',
            doctor
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all doctors for current user
 * @route   GET /api/doctors
 * @access  Private
 */
const getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            include: [{
                model: Prescription,
                as: 'prescriptions',
                attributes: ['id', 'file_path', 'date']
            }]
        });

        res.status(200).json({
            success: true,
            count: doctors.length,
            doctors
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single doctor
 * @route   GET /api/doctors/:id
 * @access  Private
 */
const getDoctorById = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            include: [{
                model: Prescription,
                as: 'prescriptions',
                order: [['date', 'DESC']]
            }]
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            doctor
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update doctor
 * @route   PUT /api/doctors/:id
 * @access  Private
 */
const updateDoctor = async (req, res, next) => {
    try {
        let doctor = await Doctor.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        doctor = await doctor.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            doctor
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete doctor
 * @route   DELETE /api/doctors/:id
 * @access  Private
 */
const deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        await doctor.destroy();

        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Upload prescription for a doctor
 * @route   POST /api/doctors/:id/prescription
 * @access  Private
 */
const uploadPrescription = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Ensure user owns the doctor record
        if (doctor.userId !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this doctor'
            });
        }

        // Save file path relative to server root
        const filePath = req.file.path.replace(/\\/g, '/'); // Ensure forward slashes for URLs

        // Get date from body or default to today
        const date = req.body.date || new Date();

        const prescription = await Prescription.create({
            doctorId: doctor.id,
            file_path: filePath,
            date: date
        });

        res.status(200).json({
            success: true,
            message: 'Prescription uploaded successfully',
            prescription
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    uploadPrescription
};
