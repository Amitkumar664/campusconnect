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
      accentColor: 'from-blue-500/10 to-transparent',
      badgeColor: 'text-[#387ED1] bg-blue-50 border-blue-200'
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
      accentColor: 'from-orange-500/10 to-transparent',
      badgeColor: 'text-[#FF5722] bg-orange-50 border-orange-200'
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
      accentColor: 'from-emerald-500/10 to-transparent',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 flex flex-col justify-between selection:bg-[#387ED1] selection:text-white relative overflow-hidden font-sans">
      {/* Dynamic Background Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-blue-500/[0.04] via-sky-500/[0.02] to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/3 -right-20 w-[600px] h-[600px] bg-blue-400/[0.03] rounded-full blur-[180px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-20 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#387ED1] flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
              Campus<span className="text-[#387ED1]">Connect</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-500 uppercase">
              SaaS v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-6 pt-16 pb-20 relative z-10 flex-1 flex flex-col justify-center text-center">
        {/* Top Pill Chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-xs text-[#387ED1] font-semibold shadow-sm mx-auto mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#387ED1]" />
          <span>Next-Generation College Booking & Executive Analytics</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#387ED1]" />
          <span className="text-slate-500 font-mono text-[11px]">Fall Term 2026</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-[1.08]"
        >
          Orchestrate Campus Assets with <br />
          <span className="text-[#387ED1]">
            Zero Scheduling Conflicts
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
        >
          A minimalist university operating system empowering students, faculty, and administrators to reserve classrooms & laboratories, book 1-on-1 doubt mentoring, and derive real-time executive business analytics.
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
              variant="primary"
              size="lg"
              className="px-8 py-3.5 text-base font-bold"
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
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Strict Double-Booking Collision Prevention</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#387ED1]" />
            <span>Real-Time MongoDB Aggregations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF5722]" />
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
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
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
                      isActive ? 'text-[#387ED1]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="landingRoleIndicator"
                        className="absolute inset-0 bg-white border border-blue-200 rounded-xl shadow-sm"
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
          <div className="rounded-3xl p-6 sm:p-10 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${rolePreviews[activeRoleTab].badgeColor}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {rolePreviews[activeRoleTab].tag}
                </span>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                  {rolePreviews[activeRoleTab].title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {rolePreviews[activeRoleTab].desc}
                </p>

                <div className="space-y-2.5 pt-2">
                  {rolePreviews[activeRoleTab].features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#387ED1]" />
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
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span>campus-engine.app</span>
                </div>

                {activeRoleTab === 'student' && (
                  <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#387ED1]">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">Dr. Sarah Jenkins</div>
                          <div className="text-[10px] text-slate-500">Distributed Systems • CS-401</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">Available</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF5722]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">Alan Turing AI Lab</div>
                          <div className="text-[10px] text-slate-500">Building B • 40 GPU Nodes</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-[#387ED1] border border-blue-200 font-mono">Slot Confirmed</span>
                    </div>
                  </div>
                )}

                {activeRoleTab === 'faculty' && (
                  <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-900">Aarav Mehta (STU-8821)</span>
                        <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-mono">Pending Review</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        "Need assistance with Kubernetes ingress controller configuration for final capstone..."
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="text-[10px] bg-[#387ED1] text-white px-2.5 py-1 rounded-md font-medium">Accept Slot</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">Decline</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeRoleTab === 'admin' && (
                  <div className="space-y-3 font-sans">
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div className="text-[10px] text-slate-400 font-mono">APPROVAL RATE</div>
                        <div className="text-lg font-bold text-emerald-600">98.4%</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div className="text-[10px] text-slate-400 font-mono">PEAK OCCUPANCY</div>
                        <div className="text-lg font-bold text-[#FF5722]">84.2%</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs">
                      <span className="text-slate-600">Export Spring Audit CSV</span>
                      <span className="text-[#387ED1] font-mono text-[11px]">Download ↓</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#387ED1] mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Faculty Doubt Sessions
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Real-time slot reservation system matching professor office hours with zero overlap risk and instant email notifications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-300 transition-all shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5722] mb-4 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Classrooms & High-Tech Labs
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Book high-performance GPU workstations, lecture halls, and seminar auditoriums with instant collision detection.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Executive Business Analytics
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Live MongoDB aggregation pipelines tracking resource utilization, approval velocity, and CSV accreditation exports.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 relative z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#387ED1]">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <p>© 2026 CampusConnect. Institutional Academic Booking & Business Analytics Platform.</p>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/login" className="hover:text-[#387ED1] transition-colors">
            Portal Login
          </Link>
          <span>•</span>
          <Link to="/register" className="hover:text-[#387ED1] transition-colors">
            Student / Faculty Registration
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
