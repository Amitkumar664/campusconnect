import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Building,
  IdCard,
  ArrowRight,
  Sparkles,
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden my-8">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-[#387ED1] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            Join Campus<span className="text-[#387ED1]">Connect</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create your institutional university account for room booking & faculty mentorship
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Animated Role Switcher Tabs */}
            <div>
              <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 relative">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`relative py-2.5 text-xs font-semibold rounded-lg transition-colors z-10 ${
                    formData.role === 'student' ? 'text-[#387ED1]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {formData.role === 'student' && (
                    <motion.div
                      layoutId="registerRolePill"
                      className="absolute inset-0 bg-white border border-blue-200 rounded-lg shadow-sm -z-10"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  Student Account
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'faculty' })}
                  className={`relative py-2.5 text-xs font-semibold rounded-lg transition-colors z-10 ${
                    formData.role === 'faculty' ? 'text-[#387ED1]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {formData.role === 'faculty' && (
                    <motion.div
                      layoutId="registerRolePill"
                      className="absolute inset-0 bg-white border border-blue-200 rounded-lg shadow-sm -z-10"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  Faculty / Mentor Account
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="e.g. Aarav Mehta"
                value={formData.fullName}
                onChange={handleChange}
                icon={User}
                required
              />

              <Input
                label="Official University Email"
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
                label={formData.role === 'student' ? 'Student ID / Roll No' : 'Employee ID'}
                name="studentOrEmployeeId"
                placeholder={formData.role === 'student' ? 'e.g. STU-2023-CS-042' : 'e.g. FAC-CSE-101'}
                value={formData.studentOrEmployeeId}
                onChange={handleChange}
                icon={IdCard}
                required
              />

              <Input
                label="Account Password"
                name="password"
                type="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />
            </div>

            <Input
              label="Academic Department"
              name="department"
              type="select"
              value={formData.department}
              onChange={handleChange}
              options={departments}
              required
            />

            <AnimatePresence>
              {formData.role === 'faculty' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100"
                >
                  <Input
                    label="Designation"
                    name="designation"
                    placeholder="e.g. Associate Professor"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                  <Input
                    label="Office Cabin"
                    name="officeRoom"
                    placeholder="e.g. Block B, Cabin 302"
                    value={formData.officeRoom}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-4 py-3"
            >
              Create Official Account <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-[#387ED1] hover:underline font-semibold">
            Sign in to portal
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
