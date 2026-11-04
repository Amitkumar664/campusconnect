import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  GraduationCap,
  CalendarCheck,
  Building2,
  Calendar,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Landing = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin/analytics" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-campus-bg text-campus-text flex flex-col justify-between selection:bg-campus-primary selection:text-campus-bg relative overflow-hidden">
      {/* Background glow effects matching reference banner */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-campus-primary/15 via-campus-mint/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-campus-amber/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-campus-primary/10 border border-campus-primary/30 flex items-center justify-center text-campus-primary shadow-glow">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-display font-extrabold text-xl text-campus-text tracking-tight">
            Campus<span className="text-campus-primary">Connect</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl w-full mx-auto px-6 py-12 md:py-20 text-center relative z-10 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-campus-card border border-campus-border text-xs text-campus-amber font-semibold shadow-glass mx-auto mb-6">
          <Sparkles className="w-4 h-4 text-campus-amber" />
          <span>Next-Generation College Booking & Analytics System</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-campus-text tracking-tight leading-[1.1]">
          Orchestrate Campus Assets with <br />
          <span className="bg-gradient-to-r from-campus-primary via-campus-mint to-campus-amber bg-clip-text text-transparent">
            Zero Scheduling Conflicts
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-campus-textMuted max-w-2xl mx-auto leading-relaxed">
          A centralized, enterprise university platform empowering students, faculty, and administrators to reserve classrooms & labs, schedule 1-on-1 doubt mentoring, and derive real-time business analytics.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button variant="amber" size="lg" className="shadow-glow-amber">
              Launch Portal Now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="lg">
              Student / Faculty Registration
            </Button>
          </Link>
        </div>

        {/* Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-campus-card p-6 rounded-2xl border border-campus-border hover:border-campus-primary/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-campus-primary/10 border border-campus-primary/20 flex items-center justify-center text-campus-primary mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-campus-text">
              Faculty Doubt Sessions
            </h3>
            <p className="text-xs text-campus-textMuted mt-1.5 leading-relaxed">
              Real-time slot reservation system matching professor office hours with zero overlap risk.
            </p>
          </div>

          <div className="bg-campus-card p-6 rounded-2xl border border-campus-border hover:border-campus-amber/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-campus-amber/10 border border-campus-amber/20 flex items-center justify-center text-campus-amber mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-campus-text">
              Classroom & Lab Reservations
            </h3>
            <p className="text-xs text-campus-textMuted mt-1.5 leading-relaxed">
              Book high-performance GPU labs, lecture amphitheaters, and seminar spaces with instant collision detection.
            </p>
          </div>

          <div className="bg-campus-card p-6 rounded-2xl border border-campus-border hover:border-campus-mint/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-campus-mint/10 border border-campus-mint/20 flex items-center justify-center text-campus-mint mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-campus-text">
              Executive Business Analytics
            </h3>
            <p className="text-xs text-campus-textMuted mt-1.5 leading-relaxed">
              Live MongoDB aggregation pipelines tracking resource utilization, approval velocity, and CSV reporting.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 border-t border-campus-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-campus-textSubtle relative z-10 gap-3">
        <p>© 2026 CampusConnect. Institutional Academic Booking Management Platform.</p>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hover:text-campus-text transition-colors">
            Portal Login
          </Link>
          <span>•</span>
          <Link to="/register" className="hover:text-campus-text transition-colors">
            Registration
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

