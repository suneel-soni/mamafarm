const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, deliveryController.getDeliveries);
router.get('/:id', protect, deliveryController.getDeliveryById);
router.post('/', protect, deliveryController.createDelivery);
router.patch('/:id/status', protect, deliveryController.updateDeliveryStatus);

module.exports = router;
