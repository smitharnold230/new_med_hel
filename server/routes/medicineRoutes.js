const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    addMedicine,
    getMedicines,
    updateMedicine,
    deleteMedicine
} = require('../controllers/medicineController');

router.use(protect);

router.route('/')
    .get(getMedicines)
    .post(addMedicine);

router.route('/:id')
    .put(updateMedicine)
    .delete(deleteMedicine);

module.exports = router;
