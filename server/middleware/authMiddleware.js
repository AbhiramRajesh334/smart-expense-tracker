const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists and has correct Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to the request
    req.user = { id: decoded.id };

    // Move to the next middleware or controller
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = authMiddleware;
