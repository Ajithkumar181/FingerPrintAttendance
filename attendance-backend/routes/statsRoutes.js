const express = require('express');
const router = express.Router();
const { getOverview,getTopAbsentees,getAttendancePercentage,getDailyAttendanceTrend, getStudentsWithoutFingerprint, getTodayAbsentees,getPresentStudentsByDate} = require('../controllers/statsController');
// Dashboard overview
router.get('/overview', getOverview);

router.get('/absentees', getTodayAbsentees);


// // Top absentees
 router.get('/top-absentees',getTopAbsentees);

// // Attendance % per student
 router.get('/attendance-percentage',getAttendancePercentage);


// // Attendance trend over time
 router.get('/daily-trend', getDailyAttendanceTrend);

// // Students without fingerprint
 router.get('/students-without-fingerprint',getStudentsWithoutFingerprint);

 router.get('/present', getPresentStudentsByDate);


 module.exports = router;
