import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Lock,
  Mail,
  User,
  Building,
  IdCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering',
    studentOrEmployeeId: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.studentOrEmployeeId) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register({ ...formData, role: 'student' });
    setLoading(false);

    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setError(result.message);
    }
  };

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Biotechnology',
    'Management Studies / MBA'
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] mesh-bg flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#387ED1]/[0.1] rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-lg relative z-10 my-8"
      >
        {/* Logo and header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#387ED1] to-[#2563EB] flex items-center justify-center text-white mx-auto mb-3 shadow-[0_0_20px_rgba(56,126,209,0.5)]">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
            Student Pass Registration
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Activate your digital collegiate account to book event tickets & join hackathons
          </p>
        </div>

        {/* Form Card */}
        <div className="p-7 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Mehta"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@campusconnect.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Student Roll / ID Number</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    required
                    name="studentOrEmployeeId"
                    value={formData.studentOrEmployeeId}
                    onChange={handleChange}
                    placeholder="e.g. STU-2024-CS-042"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1] uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">Academic Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] disabled:opacity-50 text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Student Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#64748B] mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#387ED1] hover:underline">
            Sign In here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
