import { useState, useEffect } from "react";
import axios from "axios";

function Appointment() {
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    doctor: "",
    date: "",
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const bookAppointment = async () => {
    if (!form.doctor || !form.date || !form.reason) {
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
        reason: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Book Appointment</h1>

      <br />

      <select name="doctor" value={form.doctor} onChange={handleChange}>
        <option value="">Select Doctor</option>

        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        type="text"
        name="reason"
        placeholder="Reason"
        value={form.reason}
        onChange={handleChange}
      />

      <br />
      <br />

      <button onClick={bookAppointment}>Book Appointment</button>

      <p>{message}</p>
    </div>
  );
}

export default Appointment;
