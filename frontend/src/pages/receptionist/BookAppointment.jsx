import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { User, Calendar as CalendarIcon, Plus } from "lucide-react";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "", age: "", gender: "", contact: "", email: "", address: "",
    doctor: "", date: "", slot: "", reason: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch(err) { console.error(err); }
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

  const slots = generateSlots();

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const bookAppointment = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender || !form.contact || !form.doctor || !form.date || !form.slot || !form.reason) {
      setMessage({ text: "Please fill all required fields", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/appointments/receptionist", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: "Appointment booked successfully", type: "success" });
      setForm({ name: "", age: "", gender: "", contact: "", email: "", address: "", doctor: "", date: "", slot: "", reason: "" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error booking appointment", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center max-w-5xl mx-auto w-full">
      <div className="w-full text-center sm:text-left mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Book Walk-in</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Register and assign time slots for physical hospital visits.</p>
      </div>

      <Card className="w-full border-none shadow-lg dark:bg-slate-800">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Appointment Formulation
          </CardTitle>
          <CardDescription>
            Input patient demographic data and requested scheduling block.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={bookAppointment} className="space-y-8">
            {/* Patient Information Section */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                <User className="h-4 w-4" /> Patient Demographics
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Input name="name" label="Full Name*" value={form.name} onChange={handleFormChange} placeholder="Jane Doe" required />
                <Input name="contact" label="Contact Number*" value={form.contact} onChange={handleFormChange} placeholder="e.g. +1 234 567 8900" required />
                <Input name="email" label="Email Address" type="email" value={form.email} onChange={handleFormChange} placeholder="jane@example.com" />
                <Input name="age" label="Age*" type="number" min="0" value={form.age} onChange={handleFormChange} placeholder="32" required />
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Gender*</label>
                  <select name="gender" required value={form.gender} onChange={handleFormChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-900 transition-colors">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Input name="address" label="Address" value={form.address} onChange={handleFormChange} placeholder="123 Main St..." />
              </div>
            </div>

            {/* Appointment Information Section */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                <CalendarIcon className="h-4 w-4" /> Allocation Detail
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select Doctor*</label>
                  <select name="doctor" required value={form.doctor} onChange={handleFormChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-900 transition-colors">
                    <option value="">Choose Doctor</option>
                    {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
                  </select>
                </div>

                <Input name="date" label="Date*" type="date" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={handleFormChange} required className="[color-scheme:light] dark:[color-scheme:dark]" />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Time Slot*</label>
                  <select name="slot" required value={form.slot} onChange={handleFormChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-900 transition-colors">
                    <option value="">Choose Slot</option>
                    {slots.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <Input name="reason" label="Medical Reason / Symptoms*" value={form.reason} onChange={handleFormChange} placeholder="e.g. Regular Checkup, Fever, Sprain..." required />
                </div>
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

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto px-10">
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
