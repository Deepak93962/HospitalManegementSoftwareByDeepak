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
    const res = await axios.get("http://localhost:5000/api/users/doctors");
    setDoctors(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const bookAppointment = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/appointments",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage("Appointment booked successfully");
    } catch (error) {
      setMessage("Error booking appointment");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Book Appointment</h1>

      <select name="doctor" onChange={handleChange}>
        <option>Select Doctor</option>

        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input type="date" name="date" onChange={handleChange} />

      <br />
      <br />

      <input
        type="text"
        name="reason"
        placeholder="Reason"
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
