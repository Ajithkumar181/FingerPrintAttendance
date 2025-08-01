import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Uncomment and add these pages when ready
// import Students from "./pages/Students";
 import Attendance from "./pages/AttendancePage";
// import Summary from "./pages/Summary";
// import Export from "./pages/Export";

function App() {
  return (
    <Router>
       <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Layout with Sidebar - wrap all main dashboard pages */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* Add other pages here when ready */}
          {/* <Route path="/students" element={<Students />} />  */}
          <Route path="/attendance" element={<Attendance />} />
          {/* <Route path="/summary" element={<Summary />} />
          <Route path="/export" element={<Export />} /> */}
         
        </Route>

        {/* If you have login/signup pages, define them outside the layout */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
    
  );
}

export default App;
