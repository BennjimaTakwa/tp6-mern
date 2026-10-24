const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 1. Protect private routes: verify the JWT is valid
const protect = async (req, res, next) => {
  let token;

  // Check for an Authorization header using the Bearer scheme
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract the token (after "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Cryptographically verify the signature with the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Load the associated user (password excluded)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          message: 'Not authorized, user not found'
        });
      }

      // Hand off to the next middleware or controller
      return next();
    } catch (err) {
      // Expired token: tell the client to log in again
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Votre session a expire, veuillez vous reconnecter'
        });
      }

      return res.status(401).json({
        message: 'Not authorized, invalid or expired token'
      });
    }
  }

  // No Authorization header provided
  return res.status(401).json({
    message: 'Not authorized, no token provided'
  });
};

// 2. Role-based access control (RBAC): admins only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    message: 'Access denied: administrator rights required'
  });
};

module.exports = { protect, adminOnly };
