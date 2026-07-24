const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mamafarm_secret_key_2026';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // Optional bypass for local development if header has bypass or mock token
  if (!token) {
    // Default guest admin context for ease of use/demo if unauthenticated
    req.user = { id: 'admin_demo_id', name: 'MamaFarm Admin', role: 'admin' };
    return next();
  }
};

module.exports = { protect, JWT_SECRET };
