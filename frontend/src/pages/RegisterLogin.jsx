import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    contact: "",
    gender: "",
    role: "Patient",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage("User registered successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user");
    }
  };

  const loginUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const user = res.data;

      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      if (user.role === "Patient") navigate("/appointment");
      else if (user.role === "Doctor") navigate("/doctor-dashboard");
      else if (user.role === "Receptionist") navigate("/dashboard");
      else if (user.role === "Admin") navigate("/admin-dashboard");
    } catch (err) {
      setMessage("Login failed");
    }
  };

  return (
    <div style={pageStyle}>
      {/* Title */}

      <h1 style={titleStyle}>Hospital Management System</h1>

      {/* Card */}

      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" ,color:"darkblue"}}>
          Register / Login
        </h2>

        <div style={formStyle}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="age"
            placeholder="Age"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="contact"
            placeholder="Contact"
            onChange={handleChange}
            style={inputStyle}
          />

          <select name="gender" onChange={handleChange} style={inputStyle}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select name="role" onChange={handleChange} style={inputStyle}>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div style={buttonRow}>
          <button onClick={registerUser} style={registerBtn}>
            Register
          </button>

          <button onClick={loginUser} style={loginBtn}>
            Login
          </button>
        </div>

        {message && (
          <p style={{ marginTop: "15px", textAlign: "center", color: "red" }}>
            {message}
          </p>
        )}
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
  justifyContent: "center",
};

const titleStyle = {
  color: "white",
  marginBottom: "30px",
  fontSize: "32px",
  fontWeight: "bold",
};

const cardStyle = {
  background: "white",
  padding: "35px",
  borderRadius: "12px",
  width: "380px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  background: "#f5f7fa",
  color:"black",
};

const buttonRow = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
};

const registerBtn = {
  flex: 1,
  padding: "10px",
  background: "#1e88e5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const loginBtn = {
  flex: 1,
  padding: "10px",
  background: "#43a047",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default RegisterLogin;
