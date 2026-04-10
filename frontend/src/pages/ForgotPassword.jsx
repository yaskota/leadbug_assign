import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="w-full max-w-md p-8 glass-panel rounded-2xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Reset Password</h2>
        
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-slate-400" size={20} />
              </div>
              <input
                type="email" placeholder="Enter your email" className="input-field !pl-12 w-full" required
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="text-slate-400" size={20} />
              </div>
              <input
                type="text" placeholder="Enter OTP" className="input-field !pl-12 w-full" required
                value={otp} onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-slate-400" size={20} />
              </div>
              <input
                type="password" placeholder="New Password" className="input-field !pl-12 w-full" required
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        <div className="text-center mt-6">
          <Link to="/login" className="text-brand-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
