import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
  return (
    <div>
      <h1>Hospital Dashboard</h1>
      <p>Login successful</p>

      <button onClick={() => navigate("/appointment")}>Book Appointment</button>
    </div>
  );
}

export default Dashboard;
