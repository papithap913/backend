const jwt = require('jsonwebtoken');

// JWT Middleware to protect routes
const jwtAuthMiddleware = (req, res, next) => {
  // Get the token from the request header (usually passed as 'x-auth-token')
  const token = req.header('x-auth-token');

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token using the JWT secret from the .env file
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret from .env
    req.user = decoded.user; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = jwtAuthMiddleware;
