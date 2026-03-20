import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Users, Search, Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "../../components/ui/Badge";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/patients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Walk-in Patients</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage patients registered by reception staff.</p>
        </div>
      </div>

      <Card className="border-none shadow-md bg-white dark:bg-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" /> Patient Directory
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Age / Gender</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-8">Loading data...</td></tr>
                ) : filteredPatients.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-500">No patients found.</td></tr>
                ) : (
                  filteredPatients.map(p => (
                    <tr key={p._id} className="border-b last:border-0 dark:border-slate-800/50 border-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold dark:bg-blue-900/60 dark:text-blue-300">
                            {p.name?.charAt(0) || "P"}
                          </div>
                          {p.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{p.contact || "N/A"}</td>
                      <td className="px-6 py-4">
                        <Badge variant="neutral" className="mr-2">{p.age} Yrs</Badge>
                        <span className="text-slate-500 dark:text-slate-400">{p.gender}</span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2"><Eye className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" className="h-8 px-2"><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-4 w-4" /></Button>
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
