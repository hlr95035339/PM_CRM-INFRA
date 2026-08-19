const jwt = require('jsonwebtoken');
const users = require('../data/users.json');

function signToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function loginUser(username, password) {
  const user = users.find((entry) => entry.username === username && entry.password === password);
  if (!user) {
    return null;
  }

  return {
    token: signToken(user.username),
    user: { id: user.id, username: user.username, role: user.role },
  };
}

module.exports = {
  verifyToken,
  loginUser,
};
