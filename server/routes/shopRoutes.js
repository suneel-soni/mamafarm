const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, shopController.getShops);
router.get('/:id', protect, shopController.getShopById);
router.post('/', protect, shopController.createShop);
router.put('/:id', protect, shopController.updateShop);
router.delete('/:id', protect, shopController.deleteShop);

module.exports = router;
