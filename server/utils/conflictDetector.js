const Booking = require('../models/Booking');
const FacultyProfile = require('../models/FacultyProfile');
const { minutesToTimeString } = require('./timeUtils');

/**
 * Check for scheduling conflicts in the database
 * @param {Object} params
 * @param {'faculty_session'|'resource_booking'} params.bookingType
 * @param {string} params.targetId - faculty User ID or Resource ID
 * @param {Date|string} params.date - Date object or ISO string
 * @param {number} params.startMinutes - Start time in minutes since midnight
 * @param {number} params.endMinutes - End time in minutes since midnight
 * @param {string} [params.excludeBookingId] - Optional booking ID to exclude from conflict search
 */
const detectBookingConflict = async ({
  bookingType,
  targetId,
  date,
  startMinutes,
  endMinutes,
  excludeBookingId = null
}) => {
  // Normalize date to UTC start-of-day
  const bookingDate = new Date(date);
  bookingDate.setUTCHours(0, 0, 0, 0);

  const nextDay = new Date(bookingDate);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  // Interval Overlap condition:
  // Existing.start < Requested.end AND Existing.end > Requested.start
  const filter = {
    date: { $gte: bookingDate, $lt: nextDay },
    status: { $in: ['pending', 'approved'] },
    startMinutes: { $lt: endMinutes },
    endMinutes: { $gt: startMinutes }
  };

  if (bookingType === 'faculty_session') {
    filter.faculty = targetId;
  } else {
    filter.resource = targetId;
  }

  if (excludeBookingId) {
    filter._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(filter)
    .populate('requester', 'fullName email')
    .populate('resource', 'name code')
    .populate('faculty', 'fullName department')
    .lean();

  if (conflictingBooking) {
    const existingStart = minutesToTimeString(conflictingBooking.startMinutes);
    const existingEnd = minutesToTimeString(conflictingBooking.endMinutes);
    const targetName =
      bookingType === 'faculty_session'
        ? `Faculty ${conflictingBooking.faculty?.fullName || 'member'}`
        : `Resource ${conflictingBooking.resource?.name || 'facility'}`;

    return {
      hasConflict: true,
      conflictingBooking,
      message: `Schedule conflict detected: ${targetName} is already booked from ${existingStart} to ${existingEnd} (Status: ${conflictingBooking.status}). Please choose an alternative slot.`
    };
  }

  // If faculty session, additionally verify faculty's working hours and blocked dates
  if (bookingType === 'faculty_session') {
    const facultyProfile = await FacultyProfile.findOne({ user: targetId }).lean();
    if (facultyProfile) {
      if (!facultyProfile.acceptingBookings) {
        return {
          hasConflict: true,
          message: 'This faculty member is currently not accepting new doubt session requests.'
        };
      }

      // Check blocked dates
      if (facultyProfile.blockedDates && facultyProfile.blockedDates.length > 0) {
        const isBlocked = facultyProfile.blockedDates.some((blocked) => {
          const bDate = new Date(blocked);
          return (
            bDate.getUTCFullYear() === bookingDate.getUTCFullYear() &&
            bDate.getUTCMonth() === bookingDate.getUTCMonth() &&
            bDate.getUTCDate() === bookingDate.getUTCDate()
          );
        });

        if (isBlocked) {
          return {
            hasConflict: true,
            message: 'The faculty member has blocked this date for leave/examinations. Please select another date.'
          };
        }
      }

      // Check weekly availability day
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const requestedDay = days[new Date(date).getDay()];

      const dayAvailability = facultyProfile.weeklyAvailability?.find(
        (slot) => slot.dayOfWeek === requestedDay
      );

      if (!dayAvailability) {
        return {
          hasConflict: true,
          message: `The faculty member does not offer doubt sessions on ${requestedDay}s.`
        };
      }

      const [slotStartH, slotStartM] = dayAvailability.startTime.split(':').map(Number);
      const [slotEndH, slotEndM] = dayAvailability.endTime.split(':').map(Number);
      const availStartMinutes = slotStartH * 60 + slotStartM;
      const availEndMinutes = slotEndH * 60 + slotEndM;

      if (startMinutes < availStartMinutes || endMinutes > availEndMinutes) {
        return {
          hasConflict: true,
          message: `Requested slot is outside faculty working hours on ${requestedDay} (${dayAvailability.startTime} - ${dayAvailability.endTime}).`
        };
      }
    }
  }

  return { hasConflict: false };
};

module.exports = {
  detectBookingConflict
};

