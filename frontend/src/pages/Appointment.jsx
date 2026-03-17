import { useState, useEffect } from "react";
import axios from "axios";

function Appointment() {
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    doctor: "",
    date: "",
    slot:"",
    reason: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/users/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors");
    }
  };

  const generateSlots = () => {
    const slots = [];
    let startHour = 7;
    let startMinute = 0;

    for (let i = 0; i < 20; i++) {
      // 20 slots
      const start = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;

      let endHour = startHour;
      let endMinute = startMinute + 30;

      if (endMinute === 60) {
        endHour += 1;
        endMinute = 0;
      }

      const end = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

      slots.push(`${start} - ${end}`);

      startHour = endHour;
      startMinute = endMinute;
    }

    return slots;
  };

  const slots = generateSlots();
  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const bookAppointment = async () => {
    if (!form.doctor || !form.date || !form.slot || !form.reason) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/appointments", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Appointment booked successfully");

      setForm({
        doctor: "",
        date: "",
        slot:"",
        reason: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Book Appointment</h2>

        <label style={styles.label}>Select Doctor</label>
        <select
          name="doctor"
          value={form.doctor}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Choose Doctor</option>

          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              Dr. {doc.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Appointment Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          style={styles.input}
        />

        <label style={styles.label}>Select Time Slot</label>

        <select
          name="slot"
          value={form.slot}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Choose Slot</option>

          {slots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <label style={styles.label}>Reason</label>
        <input
          type="text"
          name="reason"
          placeholder="Enter reason for appointment"
          value={form.reason}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={bookAppointment} style={styles.button}>
          Book Appointment
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef4ff",
    fontFamily: "Arial",
  },

  card: {
    width: "400px",
    background: "white",
    padding: "35px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#2563eb",
  },

  label: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },

  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "bold",
  },
};

export default Appointment;
