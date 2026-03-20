import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { CalendarDays, Clock, User, FileText } from "lucide-react";

function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    doctor: "",
    date: "",
    slot:"",
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors");
    } finally {
      setFetching(false);
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
      if (endMinute === 60) {
        endHour += 1;
        endMinute = 0;
      }
      const end = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
      slots.push(`${start} - ${end}`);
      startHour = endHour;
      startMinute = endMinute;
    }
    return slots;
  };

  const slots = generateSlots();
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    if (!form.doctor || !form.date || !form.slot || !form.reason) {
      setMessage({ text: "Please fill all fields", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/appointments", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ text: "Appointment booked successfully", type: "success" });
      setForm({ doctor: "", date: "", slot:"", reason: "" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error booking appointment", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 lg:max-w-4xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Book Appointment</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Schedule your next visit with our medical professionals.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Fill in the required information to make a new booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={bookAppointment} className="space-y-6">
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" /> Select Doctor
                </label>
                <select
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-800 transition-colors"
                  required
                >
                  <option value="">Choose Doctor</option>
                  {fetching ? (
                    <option disabled>Loading...</option>
                  ) : (
                    doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-slate-500" /> Appointment Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-800 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" /> Time Slot
                </label>
                <select
                  name="slot"
                  value={form.slot}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-800 transition-colors"
                  required
                >
                  <option value="">Choose Slot</option>
                  {slots.map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" /> Reason for Visit
                </label>
                <input
                  type="text"
                  name="reason"
                  placeholder="e.g. Regular Checkup, Fever..."
                  value={form.reason}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-800 transition-colors"
                  required
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-md flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                {message.type === 'error' ? (
                  <Badge variant="danger">Error</Badge>  
                ) : (
                  <Badge variant="success">Success</Badge>
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Booking..." : "Confirm Appointment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Appointment;
