import { useEffect, useState } from "react";
import axios from "axios";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const doctorName = localStorage.getItem("name");

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/appointments/doctor",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setAppointments(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/appointments/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    fetchAppointments();
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ color: "white", marginBottom: "30px" }}>
        Dr. {doctorName} Dashboard
      </h1>

      <div style={cardStyle}>
        <h2>Patient Appointments</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Email</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patient?.name}</td>
                <td>{a.patient?.email}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.slot}</td>
                <td>{a.reason}</td>
                <td>{a.status}</td>

                <td>
                  <select
                     
                    onChange={(e) => updateStatus(a._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirm</option>
                    <option value="Completed">Complete</option>
                    <option value="Cancelled">Cancel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  width: "100vw",
  background: "linear-gradient(135deg,#0f5cd6,#1e88e5)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "60px",
};

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "80%",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

export default DoctorDashboard;
