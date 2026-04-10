import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) return toast.error("Please provide both email and OTP");

    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("Account verified successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8 glass-panel rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Verify Your Account</h2>
          <p className="text-slate-600 mt-2">Enter the OTP sent to your email</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!location.state?.email && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-slate-400" size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field !pl-12 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">OTP</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="text-slate-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="input-field text-center tracking-widest font-mono text-lg !pl-12 w-full"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/login" className="text-brand-600 hover:underline">Return to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
