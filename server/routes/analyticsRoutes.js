const express = require('express');
const router = express.Router();
const {
  getOverviewKPIs,
  getBookingTrends,
  getResourceUtilization,
  getEventAnalytics,
  getFacultyAnalytics,
  exportAnalyticsCSV
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/overview', getOverviewKPIs);
router.get('/booking-trends', getBookingTrends);
router.get('/resource-utilization', getResourceUtilization);
router.get('/event-performance', getEventAnalytics);
router.get('/faculty-demand', getFacultyAnalytics);
router.get('/export/:type', exportAnalyticsCSV);

module.exports = router;

