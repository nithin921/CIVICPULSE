/**
 * Utility functions for text formatting and display
 */

/**
 * Convert camelCase text to proper case with spaces
 * @param {string} text - The camelCase text to convert
 * @returns {string} - Properly formatted text
 */
export const camelCaseToProperCase = (text) => {
  if (!text) return '';
  
  // Handle common cases
  const specialCases = {
    'inProgress': 'In Progress',
    'phoneOrEmail': 'Phone or Email',
    'fullName': 'Full Name',
    'phoneNumber': 'Phone Number',
    'issueCategory': 'Issue Category',
    'citizenInfo': 'Citizen Information',
    'reportIssue': 'Report Issue',
    'myReports': 'My Reports',
    'allReports': 'All Reports',
    'nearbyReports': 'Nearby Reports',
    'searchReports': 'Search Reports',
    'noReports': 'No Reports',
    'takePhoto': 'Take Photo',
    'selectPhoto': 'Select Photo',
    'reportSubmitted': 'Report Submitted',
    'ticketId': 'Ticket ID',
    'sendOTP': 'Send OTP',
    'enterOTP': 'Enter OTP'
  };

  // Return special case if exists
  if (specialCases[text]) {
    return specialCases[text];
  }

  // Convert camelCase to proper case
  return text
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim(); // Remove any leading/trailing spaces
};

/**
 * Format status text for display
 * @param {string} status - The status to format
 * @returns {string} - Formatted status text
 */
export const formatStatusText = (status) => {
  const statusMap = {
    'open': 'Open',
    'inProgress': 'In Progress',
    'in_progress': 'In Progress',
    'resolved': 'Resolved',
    'pending': 'Pending',
    'closed': 'Closed'
  };

  return statusMap[status] || camelCaseToProperCase(status);
};

/**
 * Format category text for display
 * @param {string} category - The category to format
 * @returns {string} - Formatted category text
 */
export const formatCategoryText = (category) => {
  if (!category) return '';
  
  // Capitalize first letter of each word
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
