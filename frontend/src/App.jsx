import { Routes, Route } from "react-router-dom";
import RegisterLogin from "./pages/RegisterLogin";
import Dashboard from "./pages/Dashboard";
import Appointment from "./pages/Appointment";
import DoctorDashboard from "./pages/DoctorDashboard";
// import ReceptionDashboard from "./pages/ReceptionDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      {/* <Route path="/reception-dashboard" element={<ReceptionDashboard />} /> */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
