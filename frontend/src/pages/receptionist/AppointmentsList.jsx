import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { List, Search, Filter } from "lucide-react";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort by newest first
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed": return <Badge variant="success">Confirmed</Badge>;
      case "Pending": return <Badge variant="warning">Pending</Badge>;
      case "Cancelled": return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const statusMatch = statusFilter === "All" || a.status === statusFilter;
    const doctorMatch = doctorFilter === "All" || a.doctor?._id === doctorFilter;
    const dateMatch = !dateFilter || new Date(a.date).toISOString().split("T")[0] === dateFilter;
    return statusMatch && doctorMatch && dateMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Appointments Hub</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Complete bird's-eye view of all hospital appointments with advanced filtering.</p>
      </div>

      <Card className="border-none shadow-md bg-white dark:bg-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-orange-500" /> Master List
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-orange-500">
                <Filter className="h-4 w-4 text-slate-400" />
                <select 
                  title="Filter Status"
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)} 
                  className="bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-orange-500">
                <select 
                  title="Filter Doctor"
                  value={doctorFilter} 
                  onChange={e => setDoctorFilter(e.target.value)} 
                  className="bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none w-32 truncate"
                >
                  <option value="All">All Doctors</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
                </select>
              </div>

              <input 
                type="date" 
                title="Filter Date"
                value={dateFilter} 
                onChange={e => setDateFilter(e.target.value)} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700 dark:text-slate-300 [color-scheme:light] dark:[color-scheme:dark]"
              />
              
              {(statusFilter !== "All" || doctorFilter !== "All" || dateFilter !== "") && (
                <button 
                  onClick={() => { setStatusFilter("All"); setDoctorFilter("All"); setDateFilter(""); }}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Date & Slot</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">Loading master records...</td></tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">No appointments matching this criteria.</td></tr>
                ) : (
                  filteredAppointments.map(a => (
                    <tr key={a._id} className="border-b last:border-0 dark:border-slate-800/50 border-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {new Date(a.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">{a.slot}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {a.patient?.name ? a.patient.name : <span className="italic text-slate-400">Undefined</span>}
                      </td>
                      <td className="px-6 py-4">
                        {a.doctor?.name ? "Dr. " + a.doctor.name : "Unassigned"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={a.reason}>
                        {a.reason}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(a.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
