const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Resource = require('../models/Resource');
const User = require('../models/User');

// @desc    Get high-level summary KPIs for admin analytics
// @route   GET /api/analytics/overview
// @access  Private/Admin
const getOverviewKPIs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = end;
      }
    }

    // 1. Total counts from database
    const [
      totalBookings,
      totalStudents,
      totalFaculty,
      totalResources,
      totalEvents,
      totalEventRegistrations
    ] = await Promise.all([
      Booking.countDocuments(dateFilter),
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'faculty', isActive: true }),
      Resource.countDocuments({ isActive: true }),
      Event.countDocuments({}),
      EventRegistration.countDocuments({ status: 'confirmed' })
    ]);

    // 2. Booking category counts
    const bookingCategoryCounts = await Booking.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$bookingType', count: { $sum: 1 } } }
    ]);

    let totalFacultySessions = 0;
    let totalResourceBookings = 0;
    bookingCategoryCounts.forEach((c) => {
      if (c._id === 'faculty_session') totalFacultySessions = c.count;
      if (c._id === 'resource_booking') totalResourceBookings = c.count;
    });

    // 3. Booking Status breakdown & Approval Rate
    const statusCounts = await Booking.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    let approvedCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;
    let cancelledCount = 0;

    statusCounts.forEach((s) => {
      if (s._id === 'approved') approvedCount = s.count;
      if (s._id === 'pending') pendingCount = s.count;
      if (s._id === 'rejected') rejectedCount = s.count;
      if (s._id === 'cancelled') cancelledCount = s.count;
    });

    const nonCancelledTotal = totalBookings - cancelledCount;
    const approvalRate = nonCancelledTotal > 0 ? ((approvedCount / nonCancelledTotal) * 100).toFixed(1) : 0;

    // 4. Resource Utilization Rate:
    // Total approved resource booking hours divided by total available campus resource hours in the period
    const resourceBookings = await Booking.aggregate([
      {
        $match: {
          ...dateFilter,
          bookingType: 'resource_booking',
          status: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          totalMinutesBooked: { $sum: '$durationMinutes' }
        }
      }
    ]);

    const totalHoursBooked = resourceBookings.length > 0 ? (resourceBookings[0].totalMinutesBooked / 60) : 0;
    // Assuming 30-day baseline of 10 campus operational hours per day per resource
    const campusCapacityHours = Math.max(1, totalResources * 10 * 30);
    const resourceUtilizationRate = Math.min(100, ((totalHoursBooked / campusCapacityHours) * 100)).toFixed(1);

    res.json({
      success: true,
      kpis: {
        totalBookings,
        totalEventRegistrations,
        totalFacultySessions,
        totalResourceBookings,
        totalStudents,
        totalFaculty,
        totalResources,
        totalEvents,
        approvalRate: Number(approvalRate),
        resourceUtilizationRate: Number(resourceUtilizationRate),
        statusBreakdown: {
          approved: approvedCount,
          pending: pendingCount,
          rejected: rejectedCount,
          cancelled: cancelledCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking trends over time (Daily / Weekly / Monthly)
// @route   GET /api/analytics/booking-trends
// @access  Private/Admin
const getBookingTrends = async (req, res) => {
  try {
    const { groupBy = 'daily', days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days, 10));
    startDate.setUTCHours(0, 0, 0, 0);

    let dateFormat = '%Y-%m-%d';
    if (groupBy === 'monthly') {
      dateFormat = '%Y-%m';
    } else if (groupBy === 'weekly') {
      dateFormat = '%Y-W%V';
    }

    const trends = await Booking.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: {
            dateStr: { $dateToString: { format: dateFormat, date: '$date' } },
            bookingType: '$bookingType'
          },
          count: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.dateStr': 1 } }
    ]);

    // Reshape data into continuous series for Recharts
    const mapByDate = new Map();
    trends.forEach((item) => {
      const d = item._id.dateStr;
      if (!mapByDate.has(d)) {
        mapByDate.set(d, {
          date: d,
          total: 0,
          facultySessions: 0,
          resourceBookings: 0,
          approved: 0
        });
      }
      const entry = mapByDate.get(d);
      entry.total += item.count;
      entry.approved += item.approvedCount;
      if (item._id.bookingType === 'faculty_session') {
        entry.facultySessions += item.count;
      } else {
        entry.resourceBookings += item.count;
      }
    });

    const series = Array.from(mapByDate.values());

    res.json({
      success: true,
      groupBy,
      trends: series
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resource utilization analytics
// @route   GET /api/analytics/resource-utilization
// @access  Private/Admin
const getResourceUtilization = async (req, res) => {
  try {
    // Group by resource
    const resourceStats = await Booking.aggregate([
      {
        $match: {
          bookingType: 'resource_booking',
          status: 'approved'
        }
      },
      {
        $group: {
          _id: '$resource',
          totalBookings: { $sum: 1 },
          totalMinutes: { $sum: '$durationMinutes' }
        }
      },
      {
        $lookup: {
          from: 'resources',
          localField: '_id',
          foreignField: '_id',
          as: 'resourceDetails'
        }
      },
      { $unwind: '$resourceDetails' },
      {
        $project: {
          _id: 1,
          name: '$resourceDetails.name',
          code: '$resourceDetails.code',
          type: '$resourceDetails.type',
          capacity: '$resourceDetails.capacity',
          totalBookings: 1,
          totalHours: { $round: [{ $divide: ['$totalMinutes', 60] }, 1] }
        }
      },
      { $sort: { totalHours: -1 } },
      { $limit: 10 }
    ]);

    // Type breakdown (classrooms vs labs vs seminar halls)
    const typeBreakdown = await Booking.aggregate([
      {
        $match: {
          bookingType: 'resource_booking',
          status: 'approved'
        }
      },
      {
        $lookup: {
          from: 'resources',
          localField: 'resource',
          foreignField: '_id',
          as: 'res'
        }
      },
      { $unwind: '$res' },
      {
        $group: {
          _id: '$res.type',
          bookingsCount: { $sum: 1 },
          totalHours: { $sum: { $divide: ['$durationMinutes', 60] } }
        }
      }
    ]);

    res.json({
      success: true,
      topResources: resourceStats,
      typeBreakdown: typeBreakdown.map((t) => ({
        type: t._id,
        count: t.bookingsCount,
        hours: Math.round(t.totalHours * 10) / 10
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get event analytics (most popular, capacity vs registration)
// @route   GET /api/analytics/event-performance
// @access  Private/Admin
const getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({})
      .select('title category capacity registeredCount eventDate status')
      .sort({ registeredCount: -1 })
      .limit(10)
      .lean();

    const formatted = events.map((e) => ({
      title: e.title,
      category: e.category,
      capacity: e.capacity,
      registered: e.registeredCount,
      fillRate: e.capacity > 0 ? Math.round((e.registeredCount / e.capacity) * 100) : 0,
      eventDate: e.eventDate,
      status: e.status
    }));

    // Category breakdown
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          totalEvents: { $sum: 1 },
          totalAttendees: { $sum: '$registeredCount' }
        }
      }
    ]);

    res.json({
      success: true,
      topEvents: formatted,
      categoryStats: categoryStats.map((c) => ({
        category: c._id,
        events: c.totalEvents,
        attendees: c.totalAttendees
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get faculty doubt session analytics
// @route   GET /api/analytics/faculty-demand
// @access  Private/Admin
const getFacultyAnalytics = async (req, res) => {
  try {
    const facultyDemand = await Booking.aggregate([
      {
        $match: {
          bookingType: 'faculty_session'
        }
      },
      {
        $group: {
          _id: '$faculty',
          totalRequests: { $sum: 1 },
          approvedSessions: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejectedSessions: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'facultyInfo'
        }
      },
      { $unwind: '$facultyInfo' },
      {
        $project: {
          _id: 1,
          name: '$facultyInfo.fullName',
          department: '$facultyInfo.department',
          totalRequests: 1,
          approvedSessions: 1,
          rejectedSessions: 1,
          resolutionRate: {
            $cond: [
              { $gt: ['$totalRequests', 0] },
              { $round: [{ $multiply: [{ $divide: ['$approvedSessions', '$totalRequests'] }, 100] }, 1] },
              0
            ]
          }
        }
      },
      { $sort: { totalRequests: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      facultyDemand
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export analytics records in CSV format
// @route   GET /api/analytics/export/:type
// @access  Private/Admin
const exportAnalyticsCSV = async (req, res) => {
  try {
    const { type } = req.params;

    if (type === 'bookings') {
      const bookings = await Booking.find({})
        .populate('requester', 'fullName email studentOrEmployeeId')
        .populate('faculty', 'fullName')
        .populate('resource', 'name code')
        .sort({ createdAt: -1 })
        .lean();

      let csv = 'ID,Booking Type,Date,Start Time,End Time,Subject,Status,Requester Name,Requester Email,Target Entity\n';
      bookings.forEach((b) => {
        const target = b.bookingType === 'faculty_session' ? b.faculty?.fullName : b.resource?.name;
        csv += `"${b._id}","${b.bookingType}","${new Date(b.date).toISOString().split('T')[0]}","${b.startTime}","${b.endTime}","${(b.subject || '').replace(/"/g, '""')}","${b.status}","${b.requester?.fullName || ''}","${b.requester?.email || ''}","${target || ''}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="campusconnect_bookings.csv"');
      return res.send(csv);
    } else if (type === 'events') {
      const events = await Event.find({}).sort({ eventDate: 1 }).lean();
      let csv = 'ID,Title,Category,Venue,Event Date,Start Time,End Time,Capacity,Registered Count,Status\n';
      events.forEach((e) => {
        csv += `"${e._id}","${(e.title || '').replace(/"/g, '""')}","${e.category}","${e.venue}","${new Date(e.eventDate).toISOString().split('T')[0]}","${e.startTime}","${e.endTime}",${e.capacity},${e.registeredCount},"${e.status}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="campusconnect_events.csv"');
      return res.send(csv);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid export type. Supported: bookings, events' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOverviewKPIs,
  getBookingTrends,
  getResourceUtilization,
  getEventAnalytics,
  getFacultyAnalytics,
  exportAnalyticsCSV
};

