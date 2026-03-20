import { useState, useEffect } from "react";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "../ui/Button";

export function Header() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "";

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors">
      <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            {role ? `${role} Dashboard` : 'Dashboard'}
          </h2>
        </div>
        <div className="ml-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-500 dark:text-slate-400">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 relative">
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4 py-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
              {name}
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold dark:bg-blue-900 dark:text-blue-300">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
