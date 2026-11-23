import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] mesh-bg flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#387ED1]/[0.1] rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#387ED1] to-[#2563EB] flex items-center justify-center text-white mx-auto mb-4 shadow-[0_0_25px_rgba(56,126,209,0.5)]">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
            CAMPUS<span className="text-[#387ED1]">CONNECT</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            College Events, Hackathons & Ticket Management Platform
          </p>
        </div>

        {/* Card */}
        <div className="p-7 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-1">Sign In</h2>
          <p className="text-xs text-[#64748B] mb-5">
            Access your student event passes or administrative dashboard.
          </p>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav.student@campusconnect.edu"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] disabled:opacity-50 text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to CampusConnect'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[#1E293B]">
            <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2.5">
              1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('aarav.student@campusconnect.edu', 'Student@123')}
                className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-left border border-[#334155] transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#60A5FA]">
                  <UserCheck className="w-3.5 h-3.5 text-[#387ED1]" />
                  <span>Student Demo</span>
                </div>
                <p className="text-[10px] text-[#64748B] mt-0.5 truncate">aarav.student@...</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('admin@campusconnect.edu', 'Admin@123')}
                className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-left border border-[#334155] transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#10B981]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Admin Demo</span>
                </div>
                <p className="text-[10px] text-[#64748B] mt-0.5 truncate">admin@...</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#64748B] mt-6">
          New student on campus?{' '}
          <Link to="/register" className="font-semibold text-[#387ED1] hover:underline">
            Register your student pass
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
