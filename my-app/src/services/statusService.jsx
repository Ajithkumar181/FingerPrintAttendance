import axios from "axios";

const BASE_URL = "http://localhost:3000/api"; // replace with your actual backend URL

export const fetchDashboardOverview = async () => {
  const response = await axios.get(`${BASE_URL}/stats/overview`);
  return response.data;
};

export const fetchTodayAbsentees = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}/stats/absentees?date=${date}`);
    return response.data.absentees;
  } catch (error) {
    console.error('Failed to fetch absentees:', error.message);
    throw error;
  }
};

export const initAbsentAttendance = (date) => {
  return axios.post(`${BASE_URL}/attendance/init-absent`, { date });
};

export const fetchDailyAttendanceTrend = async (date) => {
  const response = await axios.get(`http://localhost:3000/api/stats/daily-trend?date=${date}`);
  return response.data;
};

export const updateAttendanceStatus = async (student_id, status, date) => {
  const response = await axios.put('http://localhost:3000/api/attendance/update', {
    student_id,
    status,
    date,
  });
  return response.data;
};

export const fetchPresentStudentsByDate = async (date) => {
  const response = await axios.get(`${BASE_URL}/stats/present`, {
    params: { date },
  });
  // console.log(response.data);
  return response.data;
};
