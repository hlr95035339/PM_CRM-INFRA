const express = require('express');
const { body, validationResult, param } = require('express-validator');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.getOrders);

router.post(
  '/',
  body('customerId').isInt({ min: 1 }).withMessage('customerId must be a positive integer'),
  body('total').isFloat({ min: 0 }).withMessage('total must be a non-negative number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
  orderController.createOrder
);

router.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('Order id must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
  orderController.getOrder
);

module.exports = router;
