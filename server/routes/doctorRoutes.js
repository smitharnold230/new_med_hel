const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    uploadPrescription
} = require('../controllers/doctorController');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .post(protect, createDoctor)
    .get(protect, getDoctors);

router.route('/:id')
    .get(protect, getDoctorById)
    .put(protect, updateDoctor)
    .delete(protect, deleteDoctor);

router.route('/:id/prescription')
    .post(protect, upload.single('prescription'), uploadPrescription);

module.exports = router;
