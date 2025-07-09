// src/layouts/DashboardLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", icon: "📋", path: "/" },
  { label: "Students", icon: "🎓", path: "/dashboard" },
  { label: "Attendance", icon: "🕓", path: "/dashboard" },
  { label: "Summary", icon: "📈", path: "/dashboard" },
  { label: "Export CSV", icon: "📤", path: "/dashboard" },
];

const DashboardLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen font-inter bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]">
  {/* Sidebar */}
  <aside className="w-64 bg-white/90 backdrop-blur-md shadow-xl border-r border-gray-200 flex flex-col justify-between">
    <div className="p-6">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold text-indigo-600 mb-8 tracking-wide">
        🔷 Fingerprint System
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navLinks.map(({ label, icon, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all 
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${
                pathname === path
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>

    {/* Bottom Section: Logout */}
    <div className="border-t border-gray-200 p-4 text-sm text-gray-600 flex items-center justify-between">
      <span>👤 Admin</span>
      <button className="text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md px-1">
        Logout
      </button>
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 overflow-y-auto p-6 sm:p-8 transition-all duration-300">
    <Outlet />
  </main>
</div>
  );
};

export default DashboardLayout;
