/**
 * Duration and Milestone Formatter Utilities
 * Converts raw day numbers to user-friendly labels
 */

/**
 * Format duration in days to user-friendly label
 * @param {number} days - Number of days
 * @returns {string} User-friendly duration label
 */
export const formatDuration = (days) => {
  if (days === 7) return '1 Week';
  if (days === 14) return '2 Weeks';
  if (days === 21) return '3 Weeks';
  if (days === 30) return '1 Month';
  if (days === 60) return '2 Months';
  if (days === 90) return '3 Months';
  if (days === 180) return '6 Months';
  if (days === 365) return '1 Year';
  
  // Fallback for other numbers
  if (days < 30) return `${days} Days`;
  const months = Math.round(days / 30);
  return months === 1 ? '1 Month' : `${months} Months`;
};

/**
 * Format milestone day to user-friendly label
 * @param {number} day - Day number
 * @returns {string} User-friendly milestone label
 */
export const formatMilestoneDay = (day) => {
  if (day === 1) return 'Day 1';
  if (day < 7) return `Day ${day}`;
  if (day < 30) {
    const weeks = Math.floor(day / 7);
    return weeks === 1 ? '1 Week' : `${weeks} Weeks`;
  }
  if (day < 365) {
    const months = Math.round(day / 30);
    return months === 1 ? '1 Month' : `${months} Months`;
  }
  const years = Math.round(day / 365);
  return years === 1 ? '1 Year' : `${years} Years`;
};

/**
 * Round day number to nearest friendly value based on challenge duration
 * @param {number} day - Day number to round
 * @param {number} maxDuration - Total challenge duration
 * @returns {number} Rounded day number
 */
const roundToFriendlyDay = (day, maxDuration) => {
  if (day <= 1) return 1;
  if (maxDuration <= 7) return Math.round(day); // Exact for week challenges
  if (maxDuration <= 30) return Math.round(day / 5) * 5; // Round to nearest 5 days
  if (maxDuration <= 90) return Math.round(day / 7) * 7; // Round to nearest week
  return Math.round(day / 30) * 30; // Round to nearest month for longer challenges
};

/**
 * Get user-friendly milestone days for a challenge duration
 * @param {number} duration - Total challenge duration in days
 * @returns {Object} Object with bronze, silver, and gold milestone days
 */
export const getFriendlyMilestoneDays = (duration) => {
  let bronze = Math.floor(duration * 0.3);
  let silver = Math.floor(duration * 0.5);
  const gold = duration;
  
  // Round to friendly numbers
  bronze = roundToFriendlyDay(bronze, duration);
  silver = roundToFriendlyDay(silver, duration);
  
  // Ensure milestones are in order and not equal
  if (bronze >= silver) bronze = Math.max(1, silver - (duration <= 30 ? 2 : 7));
  if (silver >= gold) silver = Math.max(bronze + 1, gold - (duration <= 30 ? 1 : 7));
  
  return { bronze, silver, gold };
};

/**
 * Get suggested duration options with labels
 * @returns {Array} Array of duration objects with days and labels
 */
export const getDurationOptions = () => {
  return [
    { days: 7, label: '1 Week', shortLabel: '1W' },
    { days: 14, label: '2 Weeks', shortLabel: '2W' },
    { days: 30, label: '1 Month', shortLabel: '1M' },
  ];
};
