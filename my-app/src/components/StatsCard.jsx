// src/components/StatsCard.jsx

const StatsCard = ({ title, value, onClick }) => (
  <div
  onClick={onClick}
  role="button"
  tabIndex={0}
  className="cursor-pointer select-none bg-white/70 backdrop-blur-md 
             border border-gray-200 shadow-[0_6px_24px_rgba(0,0,0,0.05)] 
             rounded-2xl p-6 transition-all duration-300 ease-in-out 
             hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
  <h3 className="text-sm font-medium text-gray-600 mb-2 tracking-wide">
    {title}
  </h3>
  <p className="text-3xl font-bold text-indigo-600">{value}</p>
</div>

);

export default StatsCard;
