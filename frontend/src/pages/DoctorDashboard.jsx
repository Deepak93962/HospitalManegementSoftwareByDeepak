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
            <tr style={headerRow}>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Slot</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a) => (
              <tr key={a._id} style={rowStyle}>
                <td style={tdStyle}>{a.patient?.name}</td>
                <td style={tdStyle}>{a.patient?.email}</td>
                <td style={tdStyle}>{new Date(a.date).toLocaleDateString()}</td>
                <td style={tdStyle}>{a.slot}</td>
                <td style={tdStyle}>{a.reason}</td>

                <td style={tdStyle}>
                  <span
                    style={{
                      ...statusBadge,
                      backgroundColor:
                        a.status === "Confirmed"
                          ? "#16a34a"
                          : a.status === "Cancelled"
                            ? "#dc2626"
                            : a.status === "Completed"
                              ? "#2563eb"
                              : "#f59e0b",
                    }}
                  >
                    {a.status}
                  </span>
                </td>

                <td style={tdStyle}>
                  <select
                    style={selectStyle}
                    onChange={(e) => updateStatus(a._id, e.target.value)}
                  >
                    <option value="">Update</option>
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
const headerRow = {
  background: "#f3f4f6",
  textAlign: "left",
};

const thStyle = {
  padding: "12px",
  fontWeight: "600",
  borderBottom: "2px solid #e5e7eb",
  color: "#374151",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  color: "#374151",
};

const rowStyle = {
  transition: "background 0.2s",
};

const statusBadge = {
  padding: "4px 10px",
  borderRadius: "20px",
  color: "white",
  fontSize: "12px",
  fontWeight: "600",
};

const selectStyle = {
  padding: "6px 8px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  cursor: "pointer",
};

export default DoctorDashboard;
