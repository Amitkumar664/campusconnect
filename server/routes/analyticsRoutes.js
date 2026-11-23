const express = require('express');
const router = express.Router();
const {
  getOverviewKPIs,
  getRegistrationTrends,
  getEventPopularity,
  getPredictions,
  getAIInsights,
  exportAnalyticsCSV
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/overview', getOverviewKPIs);
router.get('/trends', getRegistrationTrends);
router.get('/popularity', getEventPopularity);
router.get('/predictions', getPredictions);
router.get('/insights', getAIInsights);
router.get('/export/:type', exportAnalyticsCSV);

module.exports = router;
