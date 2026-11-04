import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, BookOpen } from 'lucide-react';
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

  // Demo credential fast-fill buttons for presentations
  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-campus-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-campus-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-campus-amber/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-campus-primary/10 border border-campus-primary/30 items-center justify-center text-campus-primary shadow-glow mb-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-campus-text tracking-tight">
            Campus<span className="text-campus-primary">Connect</span>
          </h1>
          <p className="text-xs sm:text-sm text-campus-textMuted mt-1.5">
            College Booking Management & Business Analytics Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-campus-card rounded-2xl border border-campus-border p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="font-display font-semibold text-lg text-campus-text mb-1">
            Sign in to your account
          </h2>
          <p className="text-xs text-campus-textMuted mb-6">
            Enter your institutional credentials to access services
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-campus-danger/10 border border-campus-danger/30 text-xs text-campus-danger font-medium">
              {error}
            </div>
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
          <div className="mt-6 pt-5 border-t border-campus-border">
            <p className="text-[11px] font-medium text-campus-textSubtle uppercase tracking-wider mb-2.5 text-center">
              1-Click Presentation Quick Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin@campusconnect.edu', 'Admin@123')}
                className="px-2.5 py-1.5 rounded-xl bg-campus-surface border border-campus-border hover:border-campus-amber/50 text-[11px] text-campus-text font-medium flex flex-col items-center gap-1 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-campus-amber" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('dr.sharma@campusconnect.edu', 'Faculty@123')}
                className="px-2.5 py-1.5 rounded-xl bg-campus-surface border border-campus-border hover:border-campus-primary/50 text-[11px] text-campus-text font-medium flex flex-col items-center gap-1 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-campus-primary" />
                <span>Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('aarav.student@campusconnect.edu', 'Student@123')}
                className="px-2.5 py-1.5 rounded-xl bg-campus-surface border border-campus-border hover:border-campus-mint/50 text-[11px] text-campus-text font-medium flex flex-col items-center gap-1 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-campus-mint" />
                <span>Student</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <p className="text-center text-xs text-campus-textMuted mt-6">
          Don't have an institutional account yet?{' '}
          <Link to="/register" className="text-campus-primary hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

