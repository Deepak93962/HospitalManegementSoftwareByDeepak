import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

function WeeklyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // const res = await axios.get(
        //   "http://localhost:5000/api/appointments/weekly",
        // );
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/appointments/weekly",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching weekly stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Appointment Behaviour</h3>

      <BarChart width={480} height={200} data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="noShow" fill="#ef4444" />
        <Bar dataKey="reschedule" fill="#f59e0b" />
        <Bar dataKey="attended" fill="#16a34a" />
      </BarChart>
    </div>
  );
}

export default WeeklyChart;
