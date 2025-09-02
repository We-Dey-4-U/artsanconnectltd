// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Artisan = require('../models/Artisan');
const Customer = require('../models/Customer');

// middleware/authMiddleware.js
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // fetch actual user doc
      let user;
      if (decoded.role === 'artisan') {
        user = await Artisan.findById(decoded.id).select('-password');
      } else {
        user = await Customer.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 🔑 preserve role from token
      req.user = { ...user.toObject(), role: decoded.role };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'No token' });
  }
};

module.exports = { protect };