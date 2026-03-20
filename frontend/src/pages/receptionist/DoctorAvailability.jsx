import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { CheckSquare, Stethoscope, Calendar as CalendarIcon, Clock } from "lucide-react";

export default function DoctorAvailability() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && date) {
      fetchAppointments(date);
    }
  }, [selectedDoctor, date]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
      if (res.data.length > 0) setSelectedDoctor(res.data[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (selectedDate) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/appointments?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateSlots = () => {
    const slots = [];
    let startHour = 7;
    let startMinute = 0;
    for (let i = 0; i < 20; i++) {
      const start = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
      let endHour = startHour;
      let endMinute = startMinute + 30;
      if (endMinute === 60) { endHour += 1; endMinute = 0; }
      const end = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
      slots.push(`${start} - ${end}`);
      startHour = endHour;
      startMinute = endMinute;
    }
    return slots;
  };

  const stdSlots = generateSlots();
  
  // Filter appointments for the specific doctor
  const docAppointments = appointments.filter(a => a.doctor?._id === selectedDoctor && a.status !== "Cancelled");
  
  // Create a map of booked slots
  const bookedMap = {};
  docAppointments.forEach(a => {
    bookedMap[a.slot] = a;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Doctor Availability</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Scan real-time schedules to allocate time slots efficiently.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-md bg-white dark:bg-slate-800 h-fit">
          <CardHeader className="border-b border-slate-100 dark:border-slate-700">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-500" /> Filter Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" /> Select Doctor
              </label>
              <select 
                title="Select Doctor"
                value={selectedDoctor} 
                onChange={(e) => setSelectedDoctor(e.target.value)} 
                className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-900 transition-colors"
                disabled={loading}
              >
                {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Select Date
              </label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="[color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-md bg-white dark:bg-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-700 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-purple-500" /> Slot Matrix
            </CardTitle>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Free</span>
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400"><div className="w-3 h-3 rounded-full bg-red-500"></div> Booked</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {!selectedDoctor ? (
              <div className="text-center py-10 text-slate-500">Please select a doctor view their schedule.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {stdSlots.map((slot, i) => {
                  const isBooked = !!bookedMap[slot];
                  return (
                    <div 
                      key={i} 
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        isBooked 
                          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400" 
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                      }`}
                    >
                      <Clock className="h-4 w-4 mb-1 opacity-70" />
                      <span className="text-xs font-bold font-mono tracking-tight">{slot}</span>
                      <span className="text-[10px] uppercase font-semibold mt-1 opacity-80">{isBooked ? "Booked" : "Available"}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
