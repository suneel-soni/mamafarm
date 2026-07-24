const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, inventoryController.getInventory);
router.put('/:id', protect, inventoryController.updateStock);

module.exports = router;
