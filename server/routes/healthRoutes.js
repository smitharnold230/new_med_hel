const express = require('express');
const {
    createHealthLog,
    getHealthLogs,
    getHealthLog,
    updateHealthLog,
    deleteHealthLog,
    getHealthStats,
    shareHealthReport,
    exportHealthLogs
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

// Share Report
router.post('/share', shareHealthReport);

// Export logs
router.get('/export', exportHealthLogs);

module.exports = router;
