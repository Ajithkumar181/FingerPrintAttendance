import axios from "axios";

const BASE_URL = "http://localhost:3000/api"; // replace with your actual backend URL

export const fetchDashboardOverview = async () => {
  const response = await axios.get(`${BASE_URL}/stats/overview`);
  return response.data;
};

export const fetchTodayAbsentees = async (date) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/stats/absentees?date=${date}`);
    return response.data.absentees;
  } catch (error) {
    console.error('Failed to fetch absentees:', error.message);
    throw error;
  }
};
