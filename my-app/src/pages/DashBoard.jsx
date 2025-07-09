// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import AttendancePieChart from '../components/AttendancePieChart';
import { fetchDashboardOverview,fetchTodayAbsentees  } from "../services/statusService";
import AbsenteesList from '../components/AbsenteesList';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [absenteesList, setAbsenteesList] = useState([]);
  const [showAbsentees, setShowAbsentees] = useState(false);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await fetchDashboardOverview();
        setOverview(data);
        setError(false);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const handleAbsentClick = async () => {
    try {
     const today = '2025-07-10';
     console.log(today);
       const absentees = await fetchTodayAbsentees(today);
       setAbsenteesList(absentees);
       setShowAbsentees(true);
    } catch (error) {
      console.error('Error fetching absentees:', error.message);
    }
  };


  if (loading) return <p className="p-6 text-gray-600">🔄 Loading dashboard...</p>;
  if (error || !overview) return <p className="p-6 text-red-600">❌ Error loading dashboard data.</p>;

  const {
    total_students = 0,
    total_fingerprints = 0,
    attendance_today = { present: 0, absent: 0 },
    top_absentees = [],
    average_attendance_percentage = 0,
  } = overview;
   console.log(average_attendance_percentage);
  return (
    <div className="p-6 sm:p-8 min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] font-inter text-gray-800 space-y-10">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">📊 Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatsCard title="🎓 Total Students" value={total_students} />
        <StatsCard title="🧬 Fingerprints Enrolled" value={total_fingerprints} />
        <StatsCard title="✅ Present Today" value={attendance_today.present} />
        <StatsCard title="❌ Absent Today" value={attendance_today.absent} onClick={handleAbsentClick} />
        <StatsCard title="📈 Avg Attendance %" value={`${average_attendance_percentage}%`} />
      </div>

      {/* Absentees List (today) */}
      {showAbsentees && <AbsenteesList absentees={absenteesList} />}

      {/* Top Absentees Table */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-6 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4">🏆 Top 5 Absentees</h2>

        {top_absentees.length === 0 ? (
          <p className="text-gray-500 text-sm">🎉 No absentee records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">Roll No</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Absent Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {top_absentees.map((student) => (
                  <tr
                    key={student.student_id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 font-medium">{student.roll_number}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3 text-red-500 font-semibold">{student.absent_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendance Pie Chart */}
      <AttendancePieChart presentPercentage={average_attendance_percentage} />
    </div>
  );
};

export default Dashboard;
