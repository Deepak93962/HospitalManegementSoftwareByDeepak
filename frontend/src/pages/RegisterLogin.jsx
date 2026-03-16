import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Patient",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form,
      );

      setMessage("User registered successfully");
      console.log(res.data);
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

      setMessage("Login successful");

      // Role based redirect
      if (user.role === "Patient") {
        navigate("/appointment");
      } else if (user.role === "Doctor") {
        navigate("/doctor-dashboard");
      } else if (user.role === "Receptionist") {
        navigate("/dashboard");
      } else if (user.role === "Admin") {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Hospital Management System</h1>

      <h2>Register / Login</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />
      <br />
      <br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br />
      <br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br />
      <br />

      <select name="role" onChange={handleChange}>
        <option value="Patient">Patient</option>
        <option value="Doctor">Doctor</option>
        <option value="Admin">Admin</option>
        <option value="Receptionist">Receptionist</option>

      </select>

      <br />
      <br />

      <button onClick={registerUser}>Register</button>

      <button onClick={loginUser} style={{ marginLeft: "10px" }}>
        Login
      </button>

      <p>{message}</p>
    </div>
  );
}

export default RegisterLogin;
