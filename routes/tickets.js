const express = require('express');
const { body, validationResult } = require('express-validator');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.post(
  '/',
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['open', 'pending', 'closed']).withMessage('Invalid status'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
  ticketController.createTicket
);

router.get('/', ticketController.getTickets);

module.exports = router;
