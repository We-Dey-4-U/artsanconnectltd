const express = require('express');
const router = express.Router();
const { createOrder,getOrders,getOrderById,updateOrder,deleteOrder,getArtisanOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);
router.get('/artisan/:artisanId', protect, getArtisanOrders);

module.exports = router;