const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, expenseController.getExpenses);
router.post('/', protect, expenseController.createExpense);
router.delete('/:id', protect, expenseController.deleteExpense);

module.exports = router;
