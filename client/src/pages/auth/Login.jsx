import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/analytics');
      } else if (result.user.role === 'faculty') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-[#387ED1] items-center justify-center text-white shadow-sm mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Campus<span className="text-[#387ED1]">Connect</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            College Booking Management & Business Analytics Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-9 shadow-sm relative overflow-hidden">
          <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-1 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Enter your institutional credentials to access services
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. name@campusconnect.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Credentials Pill Bar */}
          <div className="mt-7 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#FF5722]" />
              <span>1-Click Presentation Fast Login</span>
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('admin@campusconnect.edu', 'Admin@123')}
                className="px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-300 text-[11px] text-slate-700 font-medium flex flex-col items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF5722]" />
                <span className="font-semibold">Admin</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('dr.sharma@campusconnect.edu', 'Faculty@123')}
                className="px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 text-[11px] text-slate-700 font-medium flex flex-col items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#387ED1]" />
                <span className="font-semibold">Faculty</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('aarav.student@campusconnect.edu', 'Student@123')}
                className="px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 text-[11px] text-slate-700 font-medium flex flex-col items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Student</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an institutional account yet?{' '}
          <Link to="/register" className="text-[#387ED1] hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
