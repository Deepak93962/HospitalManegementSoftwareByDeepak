import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import WeeklyChart from "../components/WeeklyChart";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Calendar as CalendarIcon, Users, CheckCircle, XCircle, Clock } from "lucide-react";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (value) => {
    setDate(value);
    const localDate = value.toLocaleDateString("en-CA");
    fetchAppointments(localDate);
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    fetchAppointments(today);
  }, []);

  const fetchAppointments = async (date = "") => {
    const token = localStorage.getItem("token");
    const url = date
      ? `http://localhost:5000/api/appointments?date=${date}`
      : `http://localhost:5000/api/appointments`;
    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setAppointments(res.data);
    } catch(err) { console.error("Error fetching appointments"); }
  };

  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;
  const uniqueDoctors = [...new Map(appointments.map((a) => [a.doctor?._id, a.doctor])).values()].filter(Boolean);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed": return <Badge variant="success">Confirmed</Badge>;
      case "Pending": return <Badge variant="warning">Pending</Badge>;
      case "Cancelled": return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Receptionist Hub</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage daily schedules and assist patients efficiently.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-200">Total Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{total}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-200">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{confirmed}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900 dark:text-yellow-200">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-200">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{cancelled}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-none shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle>Appointments List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4">Slot</th>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Doctor</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-slate-500 dark:text-slate-400">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <CalendarIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                            <p>No appointments for this date</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      appointments.map((a) => (
                        <tr key={a._id} className="border-b last:border-0 dark:border-slate-800/50 border-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{a.slot || "Not Assigned"}</td>
                          <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                            {a.patient?.name ? a.patient.name : <span className="text-slate-400 italic">Unknown</span>}
                          </td>
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold dark:bg-blue-900/60 dark:text-blue-300">
                              {a.doctor?.name?.charAt(0) || "D"}
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-300">Dr. {a.doctor?.name}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{a.reason}</td>
                          <td className="px-6 py-4">{getStatusBadge(a.status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <WeeklyChart />
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md dark:bg-slate-800">
            <CardHeader className="pb-2">
              <CardTitle>Calendar Filter</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="calendar-container w-full p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <Calendar onChange={handleDateChange} value={date} className="w-full border-none bg-transparent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md dark:bg-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" /> Available Doctors (Today)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {uniqueDoctors.length === 0 ? (
                  <p className="text-sm text-center py-4 text-slate-500 dark:text-slate-400">No doctors on schedule for this date.</p>
                ) : (
                  uniqueDoctors.map((doc, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg dark:bg-indigo-900/60 dark:text-indigo-300 shadow-sm">
                        {doc?.name?.charAt(0) || "D"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">Dr. {doc?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mt-0.5">Medical Professional</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;