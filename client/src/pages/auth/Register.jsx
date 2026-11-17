import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
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
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentOrEmployeeId: '',
    phone: '',
    designation: 'Assistant Professor',
    officeRoom: 'Academic Block'
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
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'faculty') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const departments = [
    { label: 'Computer Science & Engineering', value: 'Computer Science & Engineering' },
    { label: 'Information Technology', value: 'Information Technology' },
    { label: 'Artificial Intelligence & Data Science', value: 'Artificial Intelligence & Data Science' },
    { label: 'Electronics & Communication', value: 'Electronics & Communication' },
    { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
    { label: 'Civil Engineering', value: 'Civil Engineering' }
  ];

  return (
    <div className="min-h-screen bg-[#08070D] text-[#ECE8F5] mesh-bg flex items-center justify-center p-4 relative overflow-hidden my-8 font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#7C3AED]/[0.08] rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            CAMPUS<span className="text-[#8B5CF6]">.CONNECT</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9E98AE] mt-1">
            Create your institutional account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0D0C15] rounded-2xl border border-[#262135] p-6 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-60" />

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector Pill */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#9E98AE] uppercase tracking-wider">
                Select Your Role <span className="text-[#8B5CF6]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: 'student' }))}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.role === 'student'
                      ? 'bg-[#7C3AED]/20 border-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                      : 'bg-[#13111C] border-[#262135] text-[#9E98AE] hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: 'faculty' }))}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.role === 'faculty'
                      ? 'bg-[#7C3AED]/20 border-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                      : 'bg-[#13111C] border-[#262135] text-[#9E98AE] hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  Faculty Account
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                name="fullName"
                placeholder="e.g. Aarav Mehta"
                value={formData.fullName}
                onChange={handleChange}
                icon={User}
                required
              />

              <Input
                label="Institutional Email"
                name="email"
                type="email"
                placeholder="e.g. name@campusconnect.edu"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <Input
                label={formData.role === 'student' ? 'Roll / Enrollment #' : 'Employee / Faculty ID'}
                name="studentOrEmployeeId"
                placeholder={formData.role === 'student' ? 'e.g. CS2026-042' : 'e.g. FAC-CSE-009'}
                value={formData.studentOrEmployeeId}
                onChange={handleChange}
                icon={IdCard}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Academic Department"
                name="department"
                type="select"
                value={formData.department}
                onChange={handleChange}
                options={departments}
                icon={Building}
              />

              <Input
                label="Contact Phone (Optional)"
                name="phone"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {formData.role === 'faculty' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-[#13111C] border border-[#262135]">
                <Input
                  label="Academic Designation"
                  name="designation"
                  placeholder="e.g. Associate Professor"
                  value={formData.designation}
                  onChange={handleChange}
                />
                <Input
                  label="Office Room / Block"
                  name="officeRoom"
                  placeholder="e.g. Ramanujan Block 304"
                  value={formData.officeRoom}
                  onChange={handleChange}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-4"
            >
              Complete Registration <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#9E98AE] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#A78BFA] hover:text-white font-semibold transition-colors">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
