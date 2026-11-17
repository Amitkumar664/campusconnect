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
    <div className="min-h-screen bg-[#08070D] text-[#ECE8F5] mesh-bg flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#7C3AED]/[0.08] rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex w-14 h-14 rounded-2xl bg-[#7C3AED] items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] mb-4 hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </Link>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            CAMPUS<span className="text-[#8B5CF6]">.CONNECT</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9E98AE] mt-1.5 font-medium">
            Academic Booking Management & Business Analytics Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D0C15] rounded-2xl border border-[#262135] p-6 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {/* Subtle Top Bevel */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-60" />

          <h2 className="font-display font-bold text-lg sm:text-xl text-white mb-1 tracking-tight">
            Sign in to your portal
          </h2>
          <p className="text-xs text-[#9E98AE] mb-6">
            Enter your credentials to access services
          </p>

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
          <div className="mt-7 pt-5 border-t border-[#262135]">
            <p className="text-[10px] font-semibold text-[#716B82] uppercase tracking-widest mb-3 text-center flex items-center justify-center gap-1.5 font-mono">
              <Sparkles className="w-3 h-3 text-[#A78BFA]" />
              <span>1-Click Fast Demo Login</span>
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('admin@campusconnect.edu', 'Admin@123')}
                className="px-2.5 py-2.5 rounded-xl bg-[#13111C] border border-[#262135] hover:border-[#7C3AED]/60 text-[11px] text-[#ECE8F5] font-medium flex flex-col items-center gap-1.5 transition-all shadow-inner cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#A78BFA]" />
                <span className="font-semibold">Admin</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('dr.sharma@campusconnect.edu', 'Faculty@123')}
                className="px-2.5 py-2.5 rounded-xl bg-[#13111C] border border-[#262135] hover:border-[#7C3AED]/60 text-[11px] text-[#ECE8F5] font-medium flex flex-col items-center gap-1.5 transition-all shadow-inner cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#06B6D4]" />
                <span className="font-semibold">Faculty</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('aarav.student@campusconnect.edu', 'Student@123')}
                className="px-2.5 py-2.5 rounded-xl bg-[#13111C] border border-[#262135] hover:border-[#7C3AED]/60 text-[11px] text-[#ECE8F5] font-medium flex flex-col items-center gap-1.5 transition-all shadow-inner cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#10B981]" />
                <span className="font-semibold">Student</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <p className="text-center text-xs text-[#9E98AE] mt-6">
          Don't have an institutional account yet?{' '}
          <Link to="/register" className="text-[#A78BFA] hover:text-white font-semibold transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
