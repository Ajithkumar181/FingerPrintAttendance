import React, { useState } from 'react';
import { initAbsentAttendance } from '../services/statusService';
import { toast } from 'react-toastify';

const EntryAllAttendance = () => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInitAbsent = async () => {
    if (!date) {
      toast.warn('⚠️ Please select a date first.');
      return;
    }

    try {
      setLoading(true);
      const res = await initAbsentAttendance(date);
      console.log(res);
      toast.success(`✅ ${res.data.message}`);
    } catch (err) {
      const msg = err.response?.data?.error || '❌ Failed to initialize attendance.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 transition-all duration-300 border border-gray-100">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 flex items-center gap-2">
      🛑 <span>Initialize Absent Attendance</span>
    </h2>

    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
      <div className="w-full sm:w-auto flex flex-col gap-1">
        <label
          htmlFor="attendance-date"
          className="text-sm font-medium text-gray-700"
        >
          Select Date
        </label>
        <input
          id="attendance-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 w-full sm:w-56 shadow-sm"
        />
      </div>

      <button
        onClick={handleInitAbsent}
        disabled={!date || loading}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-medium text-white transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 whitespace-nowrap ${
          !date || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                5.291A7.962 7.962 0 014 12H0c0 
                3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          'Mark All Absent'
        )}
      </button>
    </div>
  </div>
);

};

export default EntryAllAttendance;
