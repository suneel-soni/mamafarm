const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, dashboardController.getDashboardSummary);
router.get('/sales', protect, dashboardController.getSalesPerformance);

module.exports = router;
