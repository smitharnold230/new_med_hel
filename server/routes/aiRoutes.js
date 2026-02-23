const express = require('express');
const router = express.Router();
const { chatWithAI, getHealthInsights, checkMedicationSafety } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chatWithAI);
router.get('/insights', protect, getHealthInsights);
router.post('/safety-check', protect, checkMedicationSafety);

module.exports = router;
