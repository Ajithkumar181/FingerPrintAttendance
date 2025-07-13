const db = require('../config/db');
const { generateCSV } = require('../utils/csvExporter');
exports.initAbsentAttendance = async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ message: 'Date is required in YYYY-MM-DD format' });
  }

  try {
    const result = await db.query(
      `INSERT INTO attendance (student_id, fingerprint_id, status, timestamp)
       SELECT s.student_id, f.fingerprint_id, 'Absent', $1::date
       FROM students s
       JOIN fingerprints f ON s.student_id = f.student_id
       WHERE NOT EXISTS (
         SELECT 1 FROM attendance a 
         WHERE a.student_id = s.student_id 
         AND DATE(a.timestamp) = $1::date
       )`,
      [date]
    );

    res.status(200).json({
      message:
        result.rowCount === 0
          ? `⚠️ All attendance records already exist for ${date}`
          : `✅ ${result.rowCount} Absent records inserted for ${date}`,
    });

  } catch (err) {
    console.error('❌ Error inserting absent records:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateAttendanceStatus = async (req, res) => {
  const { student_id, status, date } = req.body;

  // Validate input
  if (!student_id || !status || !date) {
    return res.status(400).json({ error: 'student_id, status, and date are required' });
  }

  try {
    // Attempt to update
    const result = await db.query(
      `UPDATE attendance
       SET status = $1
       WHERE student_id = $2 AND DATE(timestamp) = $3`,
      [status, student_id, date]
    );

     if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found for the given student and date',
        student_id,
        date
      });
    }

    return res.status(200).json({
      success: true,
      action: 'updated',
      student_id,
      status,
      date
    });
  } catch (error) {
    console.error('Error updating attendance:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};






exports.markAttendance = async (req, res) => {
  const { fingerprint_id } = req.body;

  if (!fingerprint_id) {
    return res.status(400).json({ message: 'fingerprint_id is required' });
  }

  try {
    // 1. Get student from fingerprint
    const studentResult = await db.query(
      `SELECT s.student_id, s.name, s.roll_number
       FROM fingerprints f
       JOIN students s ON f.student_id = s.student_id
       WHERE f.fingerprint_id = $1`,
      [fingerprint_id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: '❌ Fingerprint not found' });
    }

    const student = studentResult.rows[0];

    // 2. Check if attendance already marked as Present
    const existing = await db.query(
      `SELECT * FROM attendance 
       WHERE student_id = $1 AND DATE(timestamp) = CURRENT_DATE`,
      [student.student_id]
    );

    if (existing.rows.length > 0 && existing.rows[0].status === 'Present') {
      return res.status(200).json({
        message: `✅ ${student.name} already marked Present.`,
        time: existing.rows[0].timestamp,
      });
    }

    if (existing.rows.length === 0) {
      return res.status(400).json({
        message: `❌ Attendance record not initialized. Call /init-absent first.`,
      });
    }

    // 3. Update status to Present
    const update = await db.query(
      `UPDATE attendance
       SET status = 'Present', timestamp = CURRENT_TIMESTAMP
       WHERE student_id = $1 AND DATE(timestamp) = CURRENT_DATE
       RETURNING timestamp`,
      [student.student_id]
    );

    return res.status(200).json({
      message: `✅ Marked Present for ${student.name}`,
      name: student.name,
      roll_number: student.roll_number,
      time: update.rows[0].timestamp,
    });

  } catch (err) {
    console.error('❌ Error in markAttendance:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.exportAttendanceCSV = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ message: 'from and to dates are required (YYYY-MM-DD)' });
  }

  try {
    const result = await db.query(
      `SELECT 
  s.roll_number,
  s.name,
  s.class,
  s.department,
  COUNT(*) FILTER (WHERE a.status = 'Present') AS present_days,
  COUNT(*) FILTER (WHERE a.status = 'Absent') AS absent_days,
  (
    SELECT COUNT(DISTINCT DATE(timestamp))
    FROM attendance
    WHERE DATE(timestamp) BETWEEN $1 AND $2
  ) AS total_days
FROM attendance a
JOIN students s ON a.student_id = s.student_id
WHERE DATE(a.timestamp) BETWEEN $1 AND $2
GROUP BY s.roll_number, s.name, s.class, s.department
ORDER BY s.roll_number ASC;
`,
      [from, to]
    );

    return res.status(200).json({
      from,
      to,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (err) {
    console.error('❌ Failed to fetch summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getAttendanceSummary = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ message: 'from and to dates are required (YYYY-MM-DD)' });
  }

  try {
    // 1. Get daily attendance summary
    const attendanceResult = await db.query(
      `SELECT 
         DATE(timestamp) AS date,
         COUNT(*) FILTER (WHERE status = 'Present') AS present,
         COUNT(*) FILTER (WHERE status = 'Absent') AS absent
       FROM attendance
       WHERE DATE(timestamp) BETWEEN $1 AND $2
       GROUP BY DATE(timestamp)
       ORDER BY DATE(timestamp) ASC`,
      [from, to]
    );

    // 2. Get total strength (number of students)
    const strengthResult = await db.query(`SELECT COUNT(*) FROM students`);
    const totalStrength = parseInt(strengthResult.rows[0].count);

    // 3. Return combined response
    res.status(200).json({
      from,
      to,
      total_strength: totalStrength,
      days: attendanceResult.rows.map(row => ({
        date: row.date,
        present: parseInt(row.present),
        absent: parseInt(row.absent),
      }))
    });

  } catch (err) {
    console.error('❌ Failed to fetch summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
