const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, materialController.getMaterials);
router.get('/summary', protect, materialController.getMaterialSummary);
router.get('/:id', protect, materialController.getMaterialById);
router.post('/', protect, materialController.createMaterial);
router.put('/:id', protect, materialController.updateMaterial);
router.delete('/:id', protect, materialController.deleteMaterial);

module.exports = router;
