const express = require('express');
const router = express.Router();
const { registerArtisan, registerCustomer, login } = require('../controllers/authController');

router.post('/artisan/register', registerArtisan);
router.post('/customer/register', registerCustomer);
router.post('/login', login);

module.exports = router;