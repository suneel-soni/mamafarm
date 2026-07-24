const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, supplierController.getSuppliers);
router.get('/:id', protect, supplierController.getSupplierById);
router.post('/', protect, supplierController.createSupplier);
router.put('/:id', protect, supplierController.updateSupplier);
router.delete('/:id', protect, supplierController.deleteSupplier);

module.exports = router;
