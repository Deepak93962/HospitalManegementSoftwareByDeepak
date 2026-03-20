import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Activity, MailCheck } from "lucide-react";

function RegisterLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' | 'register' | 'forgot' | 'verifyPrompt'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", age: "", contact: "", gender: "", role: "Patient",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage({ text: res.data.message || "Registration successful! Check your email to verify your account.", type: "success" });
      setMode("verifyPrompt");
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error registering user", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const user = res.data;
      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      if (user.role === "Patient") navigate("/appointment");
      else if (user.role === "Doctor") navigate("/doctor-dashboard");
      else if (user.role === "Receptionist") navigate("/dashboard");
      else if (user.role === "Admin") navigate("/admin-dashboard");
    } catch (err) {
      if (err.response?.status === 403) {
        setMessage({ text: err.response?.data?.message || "Please verify your email before login", type: "error" });
      } else {
        setMessage({ text: err.response?.data?.message || "Invalid credentials", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: form.email });
      setMessage({ text: res.data.message || "Password reset link sent to your email", type: "success" });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error processing request", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (mode === "login") loginUser(e);
    else if (mode === "register") registerUser(e);
    else if (mode === "forgot") forgotPassword(e);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
             <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Clinify HMS
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Secure Hospital Management System
          </p>
        </div>

        <Card className="mt-8 border-none shadow-xl dark:bg-slate-800">
          <CardHeader>
            <CardTitle>
              {mode === "login" && "Welcome back"}
              {mode === "register" && "Create an account"}
              {mode === "forgot" && "Reset Password"}
              {mode === "verifyPrompt" && "Check Your Email"}
            </CardTitle>
            <CardDescription>
              {mode === "login" && "Sign in to access your dashboard"}
              {mode === "register" && "Register to book appointments and manage records"}
              {mode === "forgot" && "Enter your email to receive a password reset link"}
              {mode === "verifyPrompt" && "We sent a verification link to your email address."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "verifyPrompt" ? (
              <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center dark:bg-blue-900/20">
                    <MailCheck className="h-10 w-10" />
                  </div>
                </div>
                {message && (
                  <div className="rounded-md p-3 text-sm bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {message.text}
                  </div>
                )}
                <Button onClick={() => { setMode("login"); setMessage(""); }} className="w-full mt-4">
                  Return to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {mode === "register" && (
                  <Input name="name" label="Full Name" placeholder="John Doe" onChange={handleChange} required />
                )}
                
                <Input type="email" name="email" label="Email Address" placeholder="you@example.com" onChange={handleChange} required />
                
                {mode !== "forgot" && (
                  <Input type="password" name="password" label="Password" placeholder="••••••••" onChange={handleChange} required />
                )}

                {mode === "register" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="age" label="Age" type="number" placeholder="25" onChange={handleChange} required />
                      <Input name="contact" label="Contact Number" placeholder="+1..." onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                        <select name="gender" onChange={handleChange} required className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-800 transition-colors">
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                        <select name="role" onChange={handleChange} value={form.role} required className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-50 dark:bg-slate-800 transition-colors">
                          <option value="Patient">Patient</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Receptionist">Receptionist</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {message && (
                  <div className={`rounded-md p-3 text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {message.text}
                  </div>
                )}

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                   {loading ? "Processing..." : (mode === "login" ? "Sign in" : mode === "register" ? "Register" : "Send Reset Link")}
                </Button>

                <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  {mode === "login" && (
                    <>
                      <button type="button" onClick={() => { setMode("forgot"); setMessage(""); }} className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                        Forgot your password?
                      </button>
                      <button type="button" onClick={() => { setMode("register"); setMessage(""); }} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                        Don't have an account? Register here
                      </button>
                    </>
                  )}
                  {mode === "register" && (
                    <button type="button" onClick={() => { setMode("login"); setMessage(""); }} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                      Already have an account? Sign in
                    </button>
                  )}
                  {mode === "forgot" && (
                    <button type="button" onClick={() => { setMode("login"); setMessage(""); }} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                      Back to sign in
                    </button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterLogin;
