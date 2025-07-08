const pool = require('../config/db');

const getOverview = async (req, res) => {
  try {
    // 1. Total number of students
    const totalStudentsResult = await pool.query(`SELECT COUNT(*) FROM students`);
    const totalStudents = parseInt(totalStudentsResult.rows[0].count);

    // 2. Total fingerprints enrolled
    const totalFingerprintsResult = await pool.query(`SELECT COUNT(*) FROM fingerprints`);
    const totalFingerprints = parseInt(totalFingerprintsResult.rows[0].count);

    // 3. Today's attendance summary (Present & Absent count)
    const attendanceTodayResult = await pool.query(`
      SELECT status, COUNT(*) 
      FROM attendance 
      WHERE DATE(timestamp) = CURRENT_DATE 
      GROUP BY status
    `);

    let presentCount = 0;
    let absentCount = 0;
    attendanceTodayResult.rows.forEach(row => {
      if (row.status === 'Present') presentCount = parseInt(row.count);
      if (row.status === 'Absent') absentCount = parseInt(row.count);
    });

    // 4. Top 5 absentees (by count)
    const topAbsenteesResult = await pool.query(`
      SELECT s.student_id, s.name, s.roll_number, COUNT(*) AS absent_count
      FROM attendance a
      JOIN students s ON s.student_id = a.student_id
      WHERE a.status = 'Absent'
      GROUP BY s.student_id, s.name, s.roll_number
      ORDER BY absent_count DESC
      LIMIT 5
    `);

    const topAbsentees = topAbsenteesResult.rows;

    // 5. Average attendance percentage for all students
    const totalAttendance = await pool.query(`
      SELECT student_id, 
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present_days,
        COUNT(*) AS total_days
      FROM attendance
      GROUP BY student_id
    `);

    const avgAttendancePercentage = totalAttendance.rows.length > 0
      ? (
          totalAttendance.rows.reduce((acc, row) => {
            const percent = (row.present_days / row.total_days) * 100;
            return acc + percent;
          }, 0) / totalAttendance.rows.length
        ).toFixed(2)
      : 0;

    // ✅ Send JSON response
    res.status(200).json({
      total_students: totalStudents,
      total_fingerprints: totalFingerprints,
      attendance_today: {
        present: presentCount,
        absent: absentCount
      },
      top_absentees: topAbsentees,
      average_attendance_percentage: parseFloat(avgAttendancePercentage)
    });

  } catch (err) {
    console.error('Error fetching dashboard overview:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



// 📌 Top Absentees Controller
const getTopAbsentees = async (req, res) => {
  try {
    // Optional query param ?limit=5
    const limit = parseInt(req.query.limit) || 5;

    const result = await pool.query(`
      SELECT s.student_id, s.name, s.roll_number, COUNT(*) AS absent_count
      FROM attendance a
      JOIN students s ON a.student_id = s.student_id
      WHERE a.status = 'Absent'
      GROUP BY s.student_id, s.name, s.roll_number
      ORDER BY absent_count DESC
      LIMIT $1
    `, [limit]);

    res.status(200).json({
      top_absentees: result.rows
    });
  } catch (error) {
    console.error('Error fetching top absentees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAttendancePercentage = async (req, res) => {
  try {
    const { class: classFilter, department, from, to } = req.query;

    let baseQuery = `
      SELECT s.student_id, s.name, s.roll_number,
        COUNT(a.*) FILTER (WHERE a.status = 'Present') AS present_days,
        COUNT(a.*) AS total_days
      FROM students s
      LEFT JOIN attendance a ON a.student_id = s.student_id
    `;

    const filters = [];
    const values = [];

    if (classFilter) {
      values.push(classFilter);
      filters.push(`s.class = $${values.length}`);
    }

    if (department) {
      values.push(department);
      filters.push(`s.department = $${values.length}`);
    }

    if (from) {
      values.push(from);
      filters.push(`a.timestamp >= $${values.length}`);
    }

    if (to) {
      values.push(to);
      filters.push(`a.timestamp <= $${values.length}`);
    }

    if (filters.length > 0) {
      baseQuery += ` WHERE ` + filters.join(' AND ');
    }

    baseQuery += `
      GROUP BY s.student_id, s.name, s.roll_number
      ORDER BY s.roll_number
    `;

    const result = await pool.query(baseQuery, values);

    const percentages = result.rows.map(row => {
      const present = parseInt(row.present_days) || 0;
      const total = parseInt(row.total_days) || 0;
      const absent = total - present;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : '0.00';

      return {
        student_id: row.student_id,
        name: row.name,
        roll_number: row.roll_number,
        present_days: present,
        absent_days: absent,
        total_days: total,
        attendance_percentage: parseFloat(percentage)
      };
    });

    res.status(200).json({
      attendance_percentages: percentages
    });

  } catch (error) {
    console.error('Error fetching attendance percentages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// 📌 Detailed Daily Attendance Trend (with class)
const getDailyAttendanceTrend = async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = `
     SELECT 
  s.class,
  s.student_id,
  s.name,
  s.roll_number,
  DATE(a.timestamp) AS date,
  a.status,
  (
    SELECT 
      ROUND(
        SUM(CASE WHEN a2.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 
        2
      )
    FROM attendance a2
    WHERE a2.student_id = s.student_id
      AND DATE(a2.timestamp) <= DATE(a.timestamp)
  ) AS cumulative_attendance_percentage
FROM attendance a
JOIN students s ON s.student_id = a.student_id
    `;

    const filters = [];
    const values = [];

    if (from) {
      values.push(from);
      filters.push(`a.timestamp >= $${values.length}`);
    }

    if (to) {
      values.push(to);
      filters.push(`a.timestamp <= $${values.length}`);
    }

    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }

    query += `
      ORDER BY date ASC, s.class ASC, s.roll_number ASC
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      daily_attendance: result.rows,
    });

  } catch (error) {
    console.error('Error fetching daily attendance trend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// 📌 Students Without Fingerprint Controller
const getStudentsWithoutFingerprint = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT student_id, name, roll_number, class, department, email
      FROM students
      WHERE student_id NOT IN (
        SELECT student_id FROM fingerprints
      )
      ORDER BY roll_number
    `);

    res.status(200).json({
      students_without_fingerprint: result.rows
    });

  } catch (error) {
    console.error('Error fetching students without fingerprint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { getOverview,getTopAbsentees,getAttendancePercentage,getStudentsWithoutFingerprint,getDailyAttendanceTrend};
