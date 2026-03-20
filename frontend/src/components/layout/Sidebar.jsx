import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils";
import { LayoutDashboard, Users, CalendarDays, Activity, Settings, LogOut, FileText, UserPlus, Stethoscope, CheckSquare, List } from "lucide-react";

export function Sidebar({ role }) {
  const location = useLocation();

  const getLinksByRole = () => {
    switch (role) {
      case "Doctor":
        return [
          { name: "Dashboard", path: "/doctor-dashboard", icon: LayoutDashboard },
        ];
      case "Receptionist":
        return [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Patients", path: "/patients", icon: Users },
          { name: "Online Patients", path: "/online-patients", icon: Activity },
          { name: "Doctors", path: "/doctors", icon: Stethoscope },
          { name: "Doctor Availability", path: "/doctor-availability", icon: CheckSquare },
          { name: "Appointments", path: "/appointments", icon: List },
          { name: "Book Appointment", path: "/book-appointment", icon: UserPlus },
          { name: "Reports", path: "/dashboard", icon: FileText },
          { name: "Settings", path: "/dashboard", icon: Settings },
        ];
      case "Patient":
        return [
          { name: "Book Appointment", path: "/appointment", icon: CalendarDays },
        ];
      case "Admin":
        return [
          { name: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
        ];
      default:
        return [];
    }
  };

  const links = getLinksByRole();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="text-blue-500" />
          Clinify
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} aria-hidden="true" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <Link
          to="/"
          onClick={() => { localStorage.clear(); }}
          className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
          Logout
        </Link>
      </div>
    </div>
  );
}
