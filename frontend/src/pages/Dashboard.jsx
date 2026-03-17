// import { useNavigate } from "react-router-dom";

// function Dashboard() {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div
//         style={{
//           width: "250px",
//           background: "#111827",
//           color: "white",
//           padding: "20px",
//         }}
//       >
//         <h2>Hospital</h2>

//         <button
//           style={{ width: "100%", marginTop: "20px" }}
//           onClick={() => navigate("/dashboard")}
//         >
//           Dashboard
//         </button>

//         <button
//           style={{ width: "100%", marginTop: "10px" }}
//           onClick={() => navigate("/appointment")}
//         >
//           Book Appointment
//         </button>

//         <button
//           style={{ width: "100%", marginTop: "10px" }}
//           onClick={() => navigate("/appointments")}
//         >
//           My Appointments
//         </button>

//         <button style={{ width: "100%", marginTop: "10px" }} onClick={logout}>
//           Logout
//         </button>
//       </div>

//       {/* Main Content */}
//       <div style={{ flex: 1, padding: "40px" }}>
//         <h1>Hospital Dashboard</h1>
//         <p>Welcome to Hospital Management System</p>

//         <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
//           <div
//             style={{
//               background: "#2563eb",
//               color: "white",
//               padding: "20px",
//               borderRadius: "8px",
//               width: "200px",
//             }}
//           >
//             <h3>Appointments</h3>
//             <p>View your bookings</p>
//           </div>

//           <div
//             style={{
//               background: "#16a34a",
//               color: "white",
//               padding: "20px",
//               borderRadius: "8px",
//               width: "200px",
//             }}
//           >
//             <h3>Doctors</h3>
//             <p>Available doctors</p>
//           </div>

//           <div
//             style={{
//               background: "#ea580c",
//               color: "white",
//               padding: "20px",
//               borderRadius: "8px",
//               width: "200px",
//             }}
//           >
//             <h3>Patients</h3>
//             <p>Hospital records</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);

  const name = localStorage.getItem("name");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAppointments(res.data);
  };

  // 📊 Stats
  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>Clinify</h2>
        <p>Dashboard</p>
        <p>Appointments</p>
        <p>Patients</p>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <h2>Receptionist - {name} Dashboard</h2>
        </div>

        <div style={styles.content}>
          {/* LEFT + CENTER */}
          <div style={styles.center}>
            {/* Overview */}
            <div style={styles.cards}>
              <div style={styles.cardBlue}>
                <h2>{total}</h2>
                <p>Total</p>
              </div>

              <div style={styles.cardGreen}>
                <h2>{confirmed}</h2>
                <p>Confirmed</p>
              </div>

              <div style={styles.cardYellow}>
                <h2>{pending}</h2>
                <p>Pending</p>
              </div>

              <div style={styles.cardRed}>
                <h2>{cancelled}</h2>
                <p>Cancelled</p>
              </div>
            </div>

            {/* Today's Appointments */}
            <div style={styles.section}>
              <h3>Today's Appointments</h3>

              {appointments.slice(0, 6).map((a) => (
                <div key={a._id} style={styles.row}>
                  <span>{a.slot}</span>
                  <span>Dr. {a.doctor?.name}</span>
                  <span>{a.reason}</span>

                  <span
                    style={{
                      ...styles.badge,
                      background:
                        a.status === "Confirmed"
                          ? "#16a34a"
                          : a.status === "Pending"
                            ? "#f59e0b"
                            : "#dc2626",
                    }}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div style={styles.right}>
            {/* Calendar */}
            <div style={styles.box}>
              <h3>Calendar</h3>
              <input type="date" style={{ width: "100%", padding: "8px" }} />
            </div>

            {/* Doctors */}
            <div style={styles.box}>
              <h3>Available Doctors</h3>

              {appointments.slice(0, 5).map((a, i) => (
                <div key={i} style={styles.doctor}>
                  👨‍⚕️ Dr. {a.doctor?.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "100vh", background: "#f3f4f6" },

  sidebar: {
    width: "200px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },

  main: { flex: 1, padding: "20px" },

  header: {
    marginBottom: "20px",
  },

  content: {
    display: "flex",
    gap: "20px",
  },

  center: {
    flex: 3,
  },

  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  cards: {
    display: "flex",
    gap: "15px",
  },

  cardBlue: {
    background: "#2563eb",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: 1,
  },
  cardGreen: {
    background: "#16a34a",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: 1,
  },
  cardYellow: {
    background: "#f59e0b",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: 1,
  },
  cardRed: {
    background: "#dc2626",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: 1,
  },

  section: {
    marginTop: "20px",
    background: "white",
    padding: "15px",
    borderRadius: "10px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },

  badge: {
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
  },

  box: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
  },

  doctor: {
    padding: "8px 0",
  },
};

export default Dashboard;