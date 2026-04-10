import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Building, Phone } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", companyName: "", phno: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Registration successful! Check your email for OTP.");
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 bg-slate-50">
      <div className="w-full max-w-md p-8 glass-panel relative z-10 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create an Account</h2>
          <p className="text-slate-500 mt-2">Start sending beautiful campaigns today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="text-slate-400" size={20} />
            </div>
            <input
              type="text" placeholder="Full Name" className="input-field !pl-12 w-full" required
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-slate-400" size={20} />
            </div>
            <input
              type="email" placeholder="Email address" className="input-field !pl-12 w-full" required
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="text-slate-400" size={20} />
            </div>
            <input
              type="text" placeholder="Company Name" className="input-field !pl-12 w-full" required
              value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="text-slate-400" size={20} />
            </div>
            <input
              type="text" placeholder="Phone Number" className="input-field !pl-12 w-full" required
              value={formData.phno} onChange={(e) => setFormData({ ...formData, phno: e.target.value })}
            />
          </div>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-slate-400" size={20} />
            </div>
            <input
              type="password" placeholder="Password" className="input-field !pl-12 w-full" required
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
             {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-6 text-slate-600">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
