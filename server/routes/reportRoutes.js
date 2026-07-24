const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, reportController.getReports);

module.exports = router;
