import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Search, Stethoscope } from "lucide-react";
import { Badge } from "../../components/ui/Badge";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Medical Staff</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Directory of all registered doctors working in the hospital.</p>
      </div>

      <Card className="border-none shadow-md bg-white dark:bg-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-emerald-500" /> Doctors Directory
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Doctor Name</th>
                  <th className="px-6 py-4">Specialization</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-8">Loading data...</td></tr>
                ) : filteredDoctors.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-500">No doctors found.</td></tr>
                ) : (
                  filteredDoctors.map(d => (
                    <tr key={d._id} className="border-b last:border-0 dark:border-slate-800/50 border-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold dark:bg-emerald-900/60 dark:text-emerald-300">
                            {d.name?.charAt(0) || "D"}
                          </div>
                          Dr. {d.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {d.specialization || "General Medicine"}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {d.email} <br/> {d.contact}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success">Available</Badge>
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
