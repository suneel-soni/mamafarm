const express = require('express');
const router = express.Router();
const returnsController = require('../controllers/returnsController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, returnsController.createReturnOrder);
router.get('/', protect, returnsController.getAllReturnOrders);

module.exports = router;
