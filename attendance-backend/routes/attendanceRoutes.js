const express = require('express');
const router = express.Router();

const {
  initAbsentAttendance,
  markAttendance,
  exportAttendanceCSV,
  getAttendanceSummary,
  updateAttendanceStatus 
} = require('../controllers/attendanceController');

// 📌 1. Initialize Absent Records for Given Date
// POST /api/attendance/init-absent
router.post('/init-absent', initAbsentAttendance);

// 📌 2. Mark Present via fingerprint_id
// POST /api/attendance/mark
router.post('/mark', markAttendance);

// 📌 3. Export CSV between two dates
// GET /api/attendance/export?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/export', exportAttendanceCSV);

// 📌 4. Attendance summary per day (present/absent count)
// GET /api/attendance/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/summary', getAttendanceSummary);

router.put('/update', updateAttendanceStatus);

module.exports = router;
