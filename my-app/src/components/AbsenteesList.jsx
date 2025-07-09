const AbsenteesList = ({ absentees }) => {
  if (!absentees || absentees.length === 0) return null;

  return (
  <div className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6 mt-8 transition-all duration-300 overflow-x-auto">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
      📋 <span>Absentees List (Today)</span>
    </h2>

    <table className="min-w-full table-auto text-sm text-left text-gray-800 rounded-xl overflow-hidden">
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider">
        <tr>
          <th className="px-5 py-3">Roll No</th>
          <th className="px-5 py-3">Name</th>
          <th className="px-5 py-3">Class</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {absentees.map((student, index) => (
          <tr
            key={index}
            className={`${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } hover:bg-indigo-50 transition-colors duration-200`}
          >
            <td className="px-5 py-3 font-medium whitespace-nowrap">
              {student.roll_number}
            </td>
            <td className="px-5 py-3 whitespace-nowrap">{student.name}</td>
            <td className="px-5 py-3 whitespace-nowrap">{student.class}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

};

export default AbsenteesList;
