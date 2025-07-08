const db = require('../config/db');

// 🔹 1. Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM students ORDER BY roll_number ASC`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 🔹 2. Get single student by ID
exports.getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`SELECT * FROM students WHERE student_id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 🔹 3. Add a new student
exports.addStudent = async (req, res) => {
  const { roll_number, name, class: className, department, email } = req.body;

  if (!roll_number || !name) {
    return res.status(400).json({ message: 'roll_number and name are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO students (roll_number, name, class, department, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [roll_number, name, className, department, email]
    );

    res.status(201).json({ message: '✅ Student added successfully', student: result.rows[0] });
  } catch (err) {
    console.error('❌ Error adding student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 🔹 4. Update a student
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { roll_number, name, class: className, department, email } = req.body;

  try {
    const result = await db.query(
      `UPDATE students 
       SET roll_number = $1, name = $2, class = $3, department = $4, email = $5
       WHERE student_id = $6
       RETURNING *`,
      [roll_number, name, className, department, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: '✅ Student updated', student: result.rows[0] });
  } catch (err) {
    console.error('❌ Error updating student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 🔹 5. Delete a student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`DELETE FROM students WHERE student_id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: '✅ Student deleted', student: result.rows[0] });
  } catch (err) {
    console.error('❌ Error deleting student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
