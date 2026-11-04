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
    <div className="min-h-screen bg-[#070A09] mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-[400px] h-[400px] bg-amber-500/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-[1.5px] shadow-glow-lg mb-4">
            <div className="w-full h-full bg-[#080D0C] rounded-3xl flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Connect</span>
          </h1>
          <p className="text-xs sm:text-sm text-campus-textMuted mt-1.5 font-medium">
            College Booking Management & Business Analytics Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card-elevated rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          <h2 className="font-display font-bold text-lg sm:text-xl text-white mb-1 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-xs text-campus-textMuted mb-6">
            Enter your institutional credentials to access services
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-medium"
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
          <div className="mt-7 pt-5 border-t border-white/[0.08]">
            <p className="text-[10px] font-semibold text-campus-textSubtle uppercase tracking-widest mb-3 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>1-Click Presentation Fast Login</span>
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('admin@campusconnect.edu', 'Admin@123')}
                className="px-2.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/50 text-[11px] text-white font-medium flex flex-col items-center gap-1.5 transition-all shadow-glass cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">Admin</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('dr.sharma@campusconnect.edu', 'Faculty@123')}
                className="px-2.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-400/50 text-[11px] text-white font-medium flex flex-col items-center gap-1.5 transition-all shadow-glass cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Faculty</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => fillDemo('aarav.student@campusconnect.edu', 'Student@123')}
                className="px-2.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-teal-400/50 text-[11px] text-white font-medium flex flex-col items-center gap-1.5 transition-all shadow-glass cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span className="font-semibold">Student</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <p className="text-center text-xs text-campus-textMuted mt-6">
          Don't have an institutional account yet?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
