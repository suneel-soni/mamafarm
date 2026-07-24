const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, productionController.getBatches);
router.post('/', protect, productionController.createBatch);

module.exports = router;
