 
import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const name = localStorage.getItem("name");
  const [date, setDate] = useState(new Date());

  // calendar
  const handleDateChange = (value) => {
    setDate(value);
    const localDate = value.toLocaleDateString("en-CA");
    fetchAppointments(localDate);
  };

  // on load
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    fetchAppointments(today);
  }, []);

  // ✅ Fetch with date filter
  const fetchAppointments = async (date = "") => {
    const token = localStorage.getItem("token");

    const url = date
      ? `http://localhost:5000/api/appointments?date=${date}`
      : `http://localhost:5000/api/appointments`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setAppointments(res.data);
  };

  // ✅ Stats
  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  // ✅ Unique doctors
  const uniqueDoctors = [
    ...new Map(appointments.map((a) => [a.doctor?._id, a.doctor])).values(),
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar (Empty for now) */}
      <div style={styles.sidebar}>
        <h2>Clinify</h2>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Header */}
        <h2>Receptionist - {name} Dashboard</h2>

        {/* Date Picker */}
        {/* <input
          type="date"
          onChange={(e) => {
            setSelectedDate(e.target.value);
            fetchAppointments(e.target.value);
          }}
          style={styles.date}
        /> */}
        <h2>Appointments Overview</h2>

        <div style={styles.content}>
          {/* LEFT SIDE */}
          <div style={styles.center}>
            {/* Overview */}
            <div style={styles.cards}>
              <div style={styles.cardBlue}>Total: {total}</div>
              <div style={styles.cardGreen}>Confirmed: {confirmed}</div>
              <div style={styles.cardYellow}>Pending: {pending}</div>
              <div style={styles.cardRed}>Cancelled: {cancelled}</div>
            </div>

            {/* Table */}
            <div style={styles.tableBox}>
              <h3 style={{ marginBottom: "15px" }}>Today's Appointments</h3>

              <div style={styles.table}>
                {/* Header */}
                <div style={styles.headerRow}>
                  <span>Slot</span>
                  <span>Doctor</span>
                  <span>Patient Problem</span>
                  <span>Status</span>
                </div>

                {/* Rows */}
                {appointments.map((a) => (
                  <div key={a._id} style={styles.dataRow}>
                    <span className="slot">{a.slot || "Not Assigned"}</span>

                    <span className="doctor">Dr. {a.doctor?.name}</span>

                    <span className="reason">{a.reason}</span>

                    <span>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            a.status === "Confirmed"
                              ? "#16a34a"
                              : a.status === "Pending"
                                ? "#f59e0b"
                                : a.status === "Cancelled"
                                  ? "#dc2626"
                                  : "#3b82f6",
                        }}
                      >
                        {a.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div style={styles.right}>
            {/* Calendar */}
            <div style={styles.box}>
              <h3>Calendar</h3>

              {/* <input
                type="date"
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  fetchAppointments(e.target.value);
                }}
                style={{ width: "100%", padding: "8px" }}
              /> */}
              <div style={styles.box}>
                <Calendar onChange={handleDateChange} value={date} />
              </div>
            </div>

            {/* Unique Doctors */}
            <div style={styles.box}>
              <h3>Available Doctors</h3>

              {uniqueDoctors.map((doc, i) => (
                <div key={i} style={styles.doctor}>
                  👨‍⚕️ Dr. {doc?.name}
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
  container: {
    display: "flex",
    height: "100vh",
    background: "#f3f4f6",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "200px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },

  main: {
    flex: 1,
    padding: "20px",
  },

  date: {
    margin: "10px 0",
    padding: "8px",
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
    gap: "10px",
    marginBottom: "20px",
  },

  cardBlue: {
    background: "#2563eb",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
  },
  cardGreen: {
    background: "#16a34a",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
  },
  cardYellow: {
    background: "#f59e0b",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
  },
  cardRed: {
    background: "#dc2626",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
  },

  tableBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  },

  table: {
    display: "flex",
    flexDirection: "column",
  },

  headerRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 2fr 1fr",
    fontWeight: "bold",
    padding: "10px 0",
    borderBottom: "2px solid #e5e7eb",
    color: "#374151",
  },

  dataRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 2fr 1fr",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
    alignItems: "center",
  },

  badge: {
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
    textAlign: "center",
    minWidth: "90px",
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