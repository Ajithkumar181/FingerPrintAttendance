// utils/csvExporter.js

/**
 * Generates a CSV string from an array of objects.
 * 
 * @param {Array} rows - Array of row objects from DB (e.g., students & attendance)
 * @param {Array} columns - List of keys to include as CSV columns (e.g., ['name', 'status', 'date'])
 * @returns {string} CSV string
 */
exports.generateCSV = (rows, columns) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return columns.join(',') + '\n'; // Return header only if no data
  }

  const header = columns.join(','); // CSV Header

  const data = rows.map(row =>
    columns.map(col => {
      const value = row[col] !== null && row[col] !== undefined ? row[col] : '';
      return `"${String(value).replace(/"/g, '""')}"`; // Escape quotes
    }).join(',')
  );

  return [header, ...data].join('\n');
};
