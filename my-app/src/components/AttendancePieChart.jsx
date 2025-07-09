// src/components/AttendancePieChart.jsx
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

 const AttendancePieChart = ({ presentPercentage = 100 }) => {
  const parsedPercentage = Number(presentPercentage);
  const validPercentage = Number.isFinite(parsedPercentage) && parsedPercentage >= 0 && parsedPercentage <= 100
    ? parsedPercentage
    : 0;

  console.log("Final Attendance %:", validPercentage);

  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Attendance %',
        data: [validPercentage, 100 - validPercentage],
        backgroundColor: ['#4ade80', '#f87171'],
        borderColor: ['#22c55e', '#ef4444'],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // ...render chart here


  return (
  <div
    className="w-full max-w-3xl mx-auto bg-gradient-to-br from-white/70 to-gray-100/80 
               backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.05)] 
               transition-all duration-300 ease-in-out border border-gray-200"
    aria-label="Pie chart showing attendance summary"
  >
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
      📊 <span>Attendance Summary</span>
    </h2>

    <div className="w-full min-h-[250px] h-[300px] relative">
      <Pie
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#374151',
                font: {
                  size: 14,
                  family: 'Inter, sans-serif',
                },
                padding: 16,
                boxWidth: 14,
              },
            },
            tooltip: {
              backgroundColor: '#1f2937',
              titleColor: '#f9fafb',
              bodyColor: '#d1d5db',
              padding: 12,
              cornerRadius: 10,
              titleFont: {
                weight: 'bold',
                size: 14,
              },
              bodyFont: {
                size: 13,
              },
            },
          },
        }}
      />
    </div>
  </div>
);

};

export default AttendancePieChart;

