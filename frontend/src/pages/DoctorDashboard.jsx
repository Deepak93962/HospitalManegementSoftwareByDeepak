import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { CalendarDays, Mail, FileText, User, RefreshCw } from "lucide-react";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/appointments/doctor", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/appointments/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAppointments();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed": return <Badge variant="success">Confirmed</Badge>;
      case "Pending": return <Badge variant="warning">Pending</Badge>;
      case "Cancelled": return <Badge variant="danger">Cancelled</Badge>;
      case "Completed": return <Badge variant="default">Completed</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your Appointments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your patient schedule and update statuses.</p>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-blue-500" /> Appointment Schedule
            </CardTitle>
            <button 
              onClick={fetchAppointments}
              className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold"><div className="flex items-center gap-1.5"><User className="h-4 w-4"/> Patient</div></th>
                  <th className="px-6 py-4 font-semibold"><div className="flex items-center gap-1.5"><Mail className="h-4 w-4"/> Email</div></th>
                  <th className="px-6 py-4 font-semibold"><div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/> Date</div></th>
                  <th className="px-6 py-4 font-semibold">Slot</th>
                  <th className="px-6 py-4 font-semibold"><div className="flex items-center gap-1.5"><FileText className="h-4 w-4"/> Reason</div></th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <CalendarDays className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        <p>No appointments scheduled</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a._id} className="border-b last:border-0 border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900 dark:text-white">{a.patient?.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{a.patient?.email}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                          {a.slot}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={a.reason}>{a.reason}</td>
                      <td className="px-6 py-4">{getStatusBadge(a.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <select
                          className="text-xs rounded-md border border-slate-300 bg-white px-2 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500"
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              updateStatus(a._id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="" disabled>Update Status</option>
                          <option value="Confirmed">Confirm</option>
                          <option value="Completed">Identify Complete</option>
                          <option value="Cancelled">Cancel</option>
                        </select>
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

export default DoctorDashboard;
