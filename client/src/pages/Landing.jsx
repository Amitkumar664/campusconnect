import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  CalendarCheck,
  Building2,
  Calendar,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Layers,
  ChevronRight,
  Code2,
  Palette,
  Terminal,
  Cpu,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Landing = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeRoleTab, setActiveRoleTab] = useState('student');

  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin/analytics" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  const rolePreviews = {
    student: {
      tag: 'For Undergraduate & Research Students',
      title: 'Seamless Campus Academic Concierge',
      desc: 'Book 1-on-1 office hour doubts with professors, reserve high-performance GPU workstations and research labs, and get 1-click tickets for campus hackathons.',
      features: [
        'Real-time professor availability calendar & slot booking',
        'Automated collision prevention for computer lab seats',
        'One-click event passes with live remaining capacity counter'
      ],
      ctaText: 'Enter Student Portal',
      ctaLink: '/login',
      accentColor: 'from-emerald-500/20 to-emerald-500/5',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    faculty: {
      tag: 'For Academic Faculty & Research Mentors',
      title: 'Precision Mentorship & Office Hours Control',
      desc: 'Set recurring availability windows, review student doubt queries with submitted context, approve or decline with custom feedback, and block exam preparation blackout days.',
      features: [
        'Weekly availability scheduler with dynamic slot slicing',
        'Single-click doubt review with student academic ID cards',
        'Conflict-free calendar synchronization'
      ],
      ctaText: 'Enter Faculty Portal',
      ctaLink: '/login',
      accentColor: 'from-amber-500/20 to-amber-500/5',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    admin: {
      tag: 'For University Deans & Facility Controllers',
      title: 'Executive Institutional Operations & Business Analytics',
      desc: 'Oversee all campus reservations, audit resource occupancy rates, publish official symposiums, manage user access, and export audit-ready CSV performance metrics.',
      features: [
        'Live MongoDB aggregation pipelines tracking resource velocity',
        'Resource utilization metrics across amphitheaters & labs',
        'One-click CSV exports for accreditation audits'
      ],
      ctaText: 'Enter Executive Admin Portal',
      ctaLink: '/login',
      accentColor: 'from-sky-500/20 to-sky-500/5',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    }
  };

  return (
    <div className="min-h-screen bg-[#070A09] text-campus-text flex flex-col justify-between selection:bg-emerald-500 selection:text-black relative overflow-hidden font-sans">
      {/* Dynamic Cosmic Background Gradients & Starlight Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-emerald-500/15 via-emerald-600/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/3 -right-20 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-10 -left-20 w-[550px] h-[550px] bg-emerald-700/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Floating Design & Tech Badges (Design Driven reference motif) */}
      <div className="hidden lg:block absolute top-28 left-12 animate-float pointer-events-none z-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass">
          <Palette className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-mono text-emerald-300 font-semibold tracking-wider">UI/UX DRIVEN</span>
        </div>
      </div>

      <div className="hidden lg:block absolute top-40 right-16 animate-float-delayed pointer-events-none z-0">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-mono text-amber-300 font-semibold tracking-wider">&lt;ZERO CONFLICT/&gt;</span>
        </div>
      </div>

      <div className="hidden lg:block absolute top-[520px] left-8 animate-float pointer-events-none z-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="text-[11px] font-mono text-sky-300 font-semibold tracking-wider">AGGREGATION V8</span>
        </div>
      </div>

      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl text-white tracking-tight">
              Campus<span className="text-emerald-400">Connect</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[10px] font-mono text-campus-textSubtle uppercase">
              SaaS v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-campus-textMuted hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="shadow-glow-sm">
              Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-6 pt-12 pb-20 relative z-10 flex-1 flex flex-col justify-center text-center">
        {/* Top Pill Chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs text-amber-300 font-semibold shadow-glass mx-auto mb-8 backdrop-blur-xl"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>Next-Generation College Booking & Executive Analytics</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-campus-textSubtle font-mono text-[11px]">Fall Term 2026</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08]"
        >
          Orchestrate Campus Assets with <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(16,185,129,0.3)]">
            Zero Scheduling Conflicts
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-lg text-campus-textMuted max-w-3xl mx-auto leading-relaxed"
        >
          A design-driven, university operating platform empowering students, faculty, and administrators to reserve classrooms & laboratories, book 1-on-1 doubt mentoring, and derive real-time executive business analytics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/login">
            <Button
              variant="amber"
              size="lg"
              className="shadow-glow-amber px-8 py-3.5 text-base font-bold shine-sweep"
            >
              Launch Portal Now <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="px-7 py-3.5 text-base">
              Student / Faculty Registration
            </Button>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-campus-textSubtle">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Strict Double-Booking Collision Prevention</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Real-Time MongoDB Aggregations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
        </div>

        {/* Interactive Role Experience Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 text-left"
        >
          {/* Tab Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
              {[
                { id: 'student', label: 'Student Experience', icon: GraduationCap },
                { id: 'faculty', label: 'Faculty Experience', icon: CalendarCheck },
                { id: 'admin', label: 'Executive Administration', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeRoleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRoleTab(tab.id)}
                    className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive ? 'text-white' : 'text-campus-textMuted hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="landingRoleIndicator"
                        className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/40 rounded-xl shadow-glow-sm"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Display Card */}
          <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${rolePreviews[activeRoleTab].accentColor} rounded-full blur-[120px] pointer-events-none`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${rolePreviews[activeRoleTab].badgeColor}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {rolePreviews[activeRoleTab].tag}
                </span>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {rolePreviews[activeRoleTab].title}
                </h3>

                <p className="text-sm text-campus-textMuted leading-relaxed">
                  {rolePreviews[activeRoleTab].desc}
                </p>

                <div className="space-y-2.5 pt-2">
                  {rolePreviews[activeRoleTab].features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link to={rolePreviews[activeRoleTab].ctaLink}>
                    <Button variant="primary" size="md">
                      {rolePreviews[activeRoleTab].ctaText} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Graphic Wireframe Mockup Preview */}
              <div className="lg:col-span-5 bg-black/60 rounded-2xl border border-white/10 p-5 shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono text-campus-textSubtle">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span>campus-engine.app</span>
                </div>

                {activeRoleTab === 'student' && (
                  <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">Dr. Sarah Jenkins</div>
                          <div className="text-[10px] text-campus-textMuted">Distributed Systems • CS-401</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">Available</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">Alan Turing AI Lab</div>
                          <div className="text-[10px] text-campus-textMuted">Building B • 40 GPU Nodes</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">Slot Confirmed</span>
                    </div>
                  </div>
                )}

                {activeRoleTab === 'faculty' && (
                  <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-white">Aarav Mehta (STU-8821)</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Pending Review</span>
                      </div>
                      <p className="text-[11px] text-campus-textMuted">
                        "Need assistance with Kubernetes ingress controller configuration for final capstone..."
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md font-medium">Accept Slot</span>
                        <span className="text-[10px] bg-white/5 text-campus-textMuted px-2.5 py-1 rounded-md font-medium">Decline</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeRoleTab === 'admin' && (
                  <div className="space-y-3 font-sans">
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                        <div className="text-[10px] text-campus-textMuted font-mono">APPROVAL RATE</div>
                        <div className="text-lg font-bold text-emerald-400">98.4%</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                        <div className="text-[10px] text-campus-textMuted font-mono">PEAK OCCUPANCY</div>
                        <div className="text-lg font-bold text-amber-400">84.2%</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-campus-textMuted">Export Spring Audit CSV</span>
                      <span className="text-emerald-400 font-mono text-[11px]">Download ↓</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all shadow-glass group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              Faculty Doubt Sessions
            </h3>
            <p className="text-xs text-campus-textMuted mt-2 leading-relaxed">
              Real-time slot reservation system matching professor office hours with zero overlap risk and instant email notifications.
            </p>
          </div>

          <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all shadow-glass group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              Classrooms & High-Tech Labs
            </h3>
            <p className="text-xs text-campus-textMuted mt-2 leading-relaxed">
              Book high-performance GPU workstations, lecture halls, and seminar auditoriums with instant collision detection.
            </p>
          </div>

          <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/10 hover:border-sky-500/40 transition-all shadow-glass group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-white">
              Executive Business Analytics
            </h3>
            <p className="text-xs text-campus-textMuted mt-2 leading-relaxed">
              Live MongoDB aggregation pipelines tracking resource utilization, approval velocity, and CSV accreditation exports.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between text-xs text-campus-textSubtle relative z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <p>© 2026 CampusConnect. Institutional Academic Booking & Business Analytics Platform.</p>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/login" className="hover:text-emerald-400 transition-colors">
            Portal Login
          </Link>
          <span>•</span>
          <Link to="/register" className="hover:text-emerald-400 transition-colors">
            Student / Faculty Registration
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
