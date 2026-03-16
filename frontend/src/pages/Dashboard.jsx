import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#111827",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Hospital</h2>

        <button
          style={{ width: "100%", marginTop: "20px" }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          style={{ width: "100%", marginTop: "10px" }}
          onClick={() => navigate("/appointment")}
        >
          Book Appointment
        </button>

        <button
          style={{ width: "100%", marginTop: "10px" }}
          onClick={() => navigate("/appointments")}
        >
          My Appointments
        </button>

        <button style={{ width: "100%", marginTop: "10px" }} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        <h1>Hospital Dashboard</h1>
        <p>Welcome to Hospital Management System</p>

        <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "200px",
            }}
          >
            <h3>Appointments</h3>
            <p>View your bookings</p>
          </div>

          <div
            style={{
              background: "#16a34a",
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "200px",
            }}
          >
            <h3>Doctors</h3>
            <p>Available doctors</p>
          </div>

          <div
            style={{
              background: "#ea580c",
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "200px",
            }}
          >
            <h3>Patients</h3>
            <p>Hospital records</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
