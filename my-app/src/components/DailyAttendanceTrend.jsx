import React, { useEffect, useState } from 'react';
import { fetchDailyAttendanceTrend, updateAttendanceStatus } from '../services/statusService';
import { toast } from 'react-toastify';

const DailyAttendanceTrend = () => {
  const today = new Date().toISOString().split('T')[0]; // "2025-07-13"
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [submittedDate, setSubmittedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [editingRowId, setEditingRowId] = useState(null); // ✅ Added
  const [editedStatus, setEditedStatus] = useState('');    // ✅ Added
  


  const fetchAttendance = async (selectedDate) => {
    setLoading(true);
    try {
      const data = await fetchDailyAttendanceTrend(selectedDate); // ✅ use selectedDate not submittedDate
      setAttendanceData(data.daily_attendance || []);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submittedDate) {
      fetchAttendance(submittedDate);
    }
  }, [submittedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) {
      setSubmittedDate(date);
    }
  };

  const handleEditClick = (student) => {
    setEditingRowId(student.student_id);
    setEditedStatus(student.status); // ✅ Set current status in dropdown
  };

  const handleSaveClick = async (student_id) => {
    try {
      await updateAttendanceStatus(student_id, editedStatus, submittedDate);
      setAttendanceData((prev) =>
        prev.map((item) =>
          item.student_id === student_id ? { ...item, status: editedStatus } : item
        )
      );
      setEditingRowId(null); // ✅ Clear editing state
         // ✅ Success toast
    toast.success('Attendance updated successfully!');
    } catch (error) {
      console.error('Failed to update attendance status:', error);
      toast.error('Failed to update. Please try again.');
    }
  };

 return (
  <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-6">
    <h2 className="text-3xl font-semibold mb-8 text-gray-800 flex items-center gap-2">
      📅 Daily Attendance Trend
    </h2>

    {/* Date input form */}
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
    >
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
      >
        🔍 View Attendance
      </button>
    </form>

    {submittedDate && (
      <h3 className="text-lg font-medium mb-4 text-gray-700">
        Showing results for: <span className="font-semibold">{submittedDate}</span>
      </h3>
    )}

    {/* Loading / No Data / Table */}
    {loading ? (
      <div className="text-gray-500">Loading...</div>
    ) : attendanceData.length === 0 && submittedDate ? (
      <div className="text-gray-500">No data available for this date.</div>
    ) : (
      attendanceData.length > 0 && (
        <div className="overflow-x-auto max-h-[70vh] border rounded-lg shadow-sm">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-gray-100 text-gray-700 shadow">
              <tr>
                <th className="px-4 py-3 border border-gray-200 text-left">#</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Class</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Roll No</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Name</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Status</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Mark Time</th>
                <th className="px-4 py-3 border border-gray-200 text-left">% Attendance</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student, index) => {
                const isEditing = editingRowId === student.student_id;
                const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

                return (
                  <tr key={student.student_id} className={`${bgColor} transition`}>
                    <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                    <td className="px-4 py-3 border border-gray-200">{student.class}</td>
                    <td className="px-4 py-3 border border-gray-200">{student.roll_number}</td>
                    <td className="px-4 py-3 border border-gray-200">{student.name}</td>
                    <td className="px-4 py-3 border border-gray-200">
                      {isEditing ? (
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          className="border border-gray-300 bg-white text-gray-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-block px-3 py-1 text-sm rounded-full font-medium text-white ${
                            student.status === 'Present' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {student.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">{student.mark_time}</td>
                    <td className="px-4 py-3 border border-gray-200">{student.cumulative_attendance_percentage}%</td>
                    <td className="px-4 py-3 border border-gray-200">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveClick(student.student_id)}
                          className="text-green-600 hover:text-green-700 transition"
                          title="Save"
                        >
                          ✅
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(student)}
                          className="text-blue-600 hover:text-blue-700 transition"
                          title="Edit"
                        >
                          ✏️
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )
    )}
  </div>
);


};

export default DailyAttendanceTrend;
