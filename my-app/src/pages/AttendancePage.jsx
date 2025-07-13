import React, { useState } from 'react';
import EntryAllAttendance from '../components/EntryAllAttendance';
import DailyAttendanceTrend from '../components/DailyAttendanceTrend';

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState('entry'); // default tab

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
          📅 Attendance Management
        </h1>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 border-b border-gray-300 pb-2">
          <button
            className={`px-4 py-2 font-medium rounded-t ${
              activeTab === 'entry'
                ? 'bg-white border-t-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('entry')}
          >
            📝 Entry
          </button>
          <button
            className={`px-4 py-2 font-medium rounded-t ${
              activeTab === 'trend'
                ? 'bg-white border-t-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('trend')}
          >
            📊 Daily Trend
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {activeTab === 'entry' ? <EntryAllAttendance /> : <DailyAttendanceTrend />}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;

