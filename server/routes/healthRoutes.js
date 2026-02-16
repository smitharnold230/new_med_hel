const express = require('express');
const {
    createHealthLog,
    getHealthLogs,
    getHealthLog,
    updateHealthLog,
    deleteHealthLog,
    getHealthStats
} = require('../controllers/healthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Health log routes
router.route('/logs')
    .post(createHealthLog)
    .get(getHealthLogs);

router.route('/logs/:id')
    .get(getHealthLog)
    .put(updateHealthLog)
    .delete(deleteHealthLog);

// Statistics
router.get('/stats', getHealthStats);

module.exports = router;
