const express = require('express');
const { body, validationResult } = require('express-validator');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.get('/', customerController.getCustomers);

router.post(
  '/',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
  customerController.addCustomer
);

module.exports = router;
