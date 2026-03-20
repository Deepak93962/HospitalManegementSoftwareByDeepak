import { Routes, Route } from "react-router-dom";
import RegisterLogin from "./pages/RegisterLogin";
import Dashboard from "./pages/Dashboard";
import Appointment from "./pages/Appointment";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import VerifyEmail from "./pages/VerifyEmail";

// New modules for Receptionist Features
import Patients from "./pages/receptionist/Patients";
import OnlinePatients from "./pages/receptionist/OnlinePatients";
import Doctors from "./pages/receptionist/Doctors";
import DoctorAvailability from "./pages/receptionist/DoctorAvailability";
import AppointmentsList from "./pages/receptionist/AppointmentsList";
import BookAppointment from "./pages/receptionist/BookAppointment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterLogin />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route element={<DashboardLayout />}>
        {/* Shared / Role based Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Receptionist Expanded Modules */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/online-patients" element={<OnlinePatients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor-availability" element={<DoctorAvailability />} />
        <Route path="/appointments" element={<AppointmentsList />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Route>
    </Routes>
  );
}

export default App;
