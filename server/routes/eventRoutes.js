const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventAttendees
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public or optional user context
router.get('/', (req, res, next) => {
  // If authorization header is present, run protect, otherwise proceed
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, getAllEvents);

router.get('/my/registrations', protect, getMyRegistrations);
router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, getEventById);

// Registration actions
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

// Admin actions
router.post('/', protect, authorize('admin'), createEvent);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);
router.get('/:id/attendees', protect, authorize('admin'), getEventAttendees);

module.exports = router;

