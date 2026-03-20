import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Activity, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post(`http://localhost:5000/api/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(res.data.message || "Email successfully verified. You can now log in.");
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Invalid or expired verification link.");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className="min-h-screen grid items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-md w-full border-none shadow-xl bg-white dark:bg-slate-900 animate-in zoom-in-95 duration-500">
        <CardContent className="p-8 text-center flex flex-col items-center">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Clinify</span>
            </div>
            
            {status === "loading" && (
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-16 w-16 mb-6 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Verifying Identity</h2>
              </div>
            )}
            
            {status === "success" && (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Account Verified!</h2>
              </div>
            )}
            
            {status === "error" && (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 dark:bg-red-900/30 dark:text-red-400">
                  <XCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification Failed</h2>
              </div>
            )}
            
            <p className="text-slate-600 dark:text-slate-400 mb-8 mt-4">{message}</p>
            
            {status !== "loading" && (
              <Link to="/">
                <Button className="w-full flex items-center gap-2 justify-center">
                  Continue to Login <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
