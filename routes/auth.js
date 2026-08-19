const express = require('express');
const { body, validationResult } = require('express-validator');
const { loginUser } = require('../utils/auth');

const router = express.Router();

router.post(
  '/login',
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
  (req, res) => {
    const { username, password } = req.body;
    const authResult = loginUser(username, password);

    if (!authResult) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    return res.json(authResult);
  }
);

module.exports = router;
