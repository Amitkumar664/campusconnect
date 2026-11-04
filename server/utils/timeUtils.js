/**
 * Time manipulation and interval calculation utilities for CampusConnect
 */

/**
 * Convert time string "HH:mm" into minutes since midnight
 * @param {string} timeStr - e.g. "09:30" or "14:15"
 * @returns {number} minutes integer (0 - 1439)
 */
const timeStringToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight back into zero-padded "HH:mm"
 * @param {number} totalMinutes - e.g. 570 -> "09:30"
 * @returns {string} "HH:mm"
 */
const minutesToTimeString = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Test whether two open/half-open intervals overlap: [startA, endA) and [startB, endB)
 * Two intervals overlap if and only if: max(startA, startB) < min(endA, endB)
 */
const doIntervalsOverlap = (startA, endA, startB, endB) => {
  return Math.max(startA, startB) < Math.min(endA, endB);
};

/**
 * Validate format "HH:mm"
 */
const isValidTimeFormat = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return false;
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr.trim());
};

/**
 * Normalize date to UTC start-of-day YYYY-MM-DD
 */
const normalizeDate = (dateInput) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

module.exports = {
  timeStringToMinutes,
  minutesToTimeString,
  doIntervalsOverlap,
  isValidTimeFormat,
  normalizeDate
};

