import React, { useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Star,
  Search,
  Check,
  X,
  Smartphone,
  CreditCard,
  QrCode,
  Users,
  Sun,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Landing = () => {
  const { user, isAuthenticated } = useAuth();

  // If already authenticated, redirect to corresponding dashboard
  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin/analytics" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  // --- Interactive State for Mobile Door Check-in Simulator ---
  const [attendees, setAttendees] = useState([
    { id: '1', name: 'Aoife Brennan', code: 'A-06FNGUA', type: 'General admit', checkedIn: true, time: '14:22' },
    { id: '2', name: 'Marcus Whitfield', code: 'A-00XJQ8U', type: 'General admit', checkedIn: true, time: '14:25' },
    { id: '3', name: 'Priya Raghunathan', code: 'A-JVXNJAB', type: 'Research Lead', checkedIn: true, time: '14:30' },
    { id: '4', name: 'Tomás Ferreira', code: 'A-2DJDXV2', type: 'General admit', checkedIn: false, time: null },
    { id: '5', name: 'Hannah Okonkwo', code: 'A-89KLP12', type: 'Hackathon VIP', checkedIn: false, time: null },
    { id: '6', name: 'Arjun Mehta', code: 'A-77PLQ99', type: 'AI Lab Station 4', checkedIn: false, time: null },
    { id: '7', name: 'Devon Vance', code: 'A-33TRM81', type: 'Speaker / Faculty', checkedIn: true, time: '14:35' },
    { id: '8', name: 'Sarah Lin', code: 'A-44BVC22', type: 'General admit', checkedIn: false, time: null },
  ]);

  const [doorSearch, setDoorSearch] = useState('');
  const [doorFilter, setDoorFilter] = useState('all'); // 'all' | 'remaining' | 'checked_in'

  const toggleCheckIn = (id) => {
    setAttendees((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checkedIn: !item.checkedIn,
              time: !item.checkedIn
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : null
            }
          : item
      )
    );
  };

  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const remainingCount = attendees.length - checkedInCount;

  const filteredAttendees = useMemo(() => {
    return attendees.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(doorSearch.toLowerCase()) ||
        a.code.toLowerCase().includes(doorSearch.toLowerCase()) ||
        a.type.toLowerCase().includes(doorSearch.toLowerCase());

      if (!matchesSearch) return false;
      if (doorFilter === 'remaining') return !a.checkedIn;
      if (doorFilter === 'checked_in') return a.checkedIn;
      return true;
    });
  }, [attendees, doorSearch, doorFilter]);

  // --- Interactive State for Seat Map Picker ---
  const [selectedSeat, setSelectedSeat] = useState('B-04');
  const seats = [
    { id: 'A-01', row: 'A', num: 1, status: 'occupied' },
    { id: 'A-02', row: 'A', num: 2, status: 'occupied' },
    { id: 'A-03', row: 'A', num: 3, status: 'available' },
    { id: 'A-04', row: 'A', num: 4, status: 'available' },
    { id: 'A-05', row: 'A', num: 5, status: 'occupied' },
    { id: 'A-06', row: 'A', num: 6, status: 'available' },
    { id: 'B-01', row: 'B', num: 1, status: 'available' },
    { id: 'B-02', row: 'B', num: 2, status: 'occupied' },
    { id: 'B-03', row: 'B', num: 3, status: 'available' },
    { id: 'B-04', row: 'B', num: 4, status: 'selected' },
    { id: 'B-05', row: 'B', num: 5, status: 'available' },
    { id: 'B-06', row: 'B', num: 6, status: 'occupied' },
    { id: 'C-01', row: 'C', num: 1, status: 'available' },
    { id: 'C-02', row: 'C', num: 2, status: 'available' },
    { id: 'C-03', row: 'C', num: 3, status: 'occupied' },
    { id: 'C-04', row: 'C', num: 4, status: 'available' },
    { id: 'C-05', row: 'C', num: 5, status: 'available' },
    { id: 'C-06', row: 'C', num: 6, status: 'available' },
  ];

  // --- Interactive State for Pass Branding Color Picker ---
  const colorOptions = [
    { name: 'Forest Green', hex: '#10B981' },
    { name: 'Electric Coral', hex: '#F43F5E' },
    { name: 'Deep Violet', hex: '#8B5CF6' },
    { name: 'Ocean Cyan', hex: '#0EA5E9' },
    { name: 'Amber Gold', hex: '#F59E0B' },
  ];
  const [brandColor, setBrandColor] = useState(colorOptions[0].hex);

  return (
    <div className="min-h-screen bg-[#08070D] text-[#ECE8F5] flex flex-col justify-between selection:bg-[#7C3AED] selection:text-white relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#7C3AED]/[0.09] via-[#8B5CF6]/[0.04] to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed top-1/3 -right-20 w-[600px] h-[600px] bg-[#7C3AED]/[0.05] rounded-full blur-[200px] pointer-events-none" />

      {/* ========================================================
          TOP NAVIGATION BAR (hi.events style)
         ======================================================== */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-20 border-b border-[#262135]">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight">
            CAMPUS<span className="text-[#8B5CF6]">.CONNECT</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9E98AE]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#door-checkin" className="hover:text-white transition-colors">Door App</a>
          <a href="#seating" className="hover:text-white transition-colors">Seat Maps</a>
          <a href="#architecture" className="hover:text-white transition-colors">Platform Specs</a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs sm:text-sm font-semibold text-[#C7C3D6] hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] cursor-pointer"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION (hi.events "AI assistants, seat maps...")
         ======================================================== */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-6 max-w-7xl mx-auto text-center w-full">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13111C] border border-[#262135] text-[11px] font-mono uppercase tracking-widest text-[#A78BFA] mb-8 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
          NEW IN CAMPUS.CONNECT
        </div>

        {/* Punchy Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6">
          AI assistants, seat maps, a door check-in box office and more
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-[#9E98AE] max-w-2xl mx-auto leading-relaxed mb-10">
          Manage your events and lab bookings from Claude or ChatGPT, reserve exact seats and GPU stations,
          track door admissions in real-time, and give every student and faculty member exactly the access they need.
        </p>

        {/* Interactive AI Assistant Command Console Mockup */}
        <div className="mt-8 max-w-4xl mx-auto rounded-2xl bg-[#0D0C15] border border-[#262135] p-6 sm:p-8 text-left shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden group">
          {/* Subtle Top Glow */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-60" />

          {/* Top Console Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#262135] mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-[#716B82]">Your AI assistant</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#34D399] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              CampusConnect connected
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left AI Pitch */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C4B5FD] text-[10px] font-bold tracking-wider uppercase">
                NEW
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                Run your campus by asking.
              </h3>
              <p className="text-xs sm:text-sm text-[#9E98AE] leading-relaxed">
                Connect your AI assistant and ask it to find an available professor, reserve a high-performance GPU lab station, or re-send admission passes.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#A78BFA] hover:text-white transition-colors"
              >
                See what it can do <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Right Interactive Mockup Window */}
            <div className="lg:col-span-7 rounded-xl bg-[#13111C] border border-[#262135] p-4 text-xs font-mono space-y-3 shadow-inner">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#262135] text-[#ECE8F5] px-3.5 py-2 rounded-xl rounded-tr-sm max-w-xs">
                  Look up student Dave at HACK/26 and approve his reservation
                </div>
              </div>

              {/* Tool Execution */}
              <div className="space-y-1 text-[11px] text-[#716B82] pl-2 border-l-2 border-[#7C3AED]">
                <div className="flex items-center gap-2 text-[#A78BFA]">
                  <span>⚡ CC.list_students</span>
                  <span className="text-[#9E98AE]">search "Dave"</span>
                  <span className="ml-auto text-[10px] text-[#716B82]">2 found</span>
                </div>
              </div>

              {/* Table result */}
              <div className="rounded-lg border border-[#262135] overflow-hidden bg-[#0D0C15]">
                <div className="grid grid-cols-3 bg-[#1B1828] px-3 py-1.5 text-[10px] text-[#9E98AE] font-semibold uppercase">
                  <span>Student</span>
                  <span>Resource</span>
                  <span className="text-right">Status</span>
                </div>
                <div className="divide-y divide-[#262135] text-[11px]">
                  <div className="grid grid-cols-3 px-3 py-2 text-[#ECE8F5] items-center">
                    <span className="font-medium text-white truncate">Dave Murphy</span>
                    <span className="text-[#9E98AE] truncate">Turing Lab #4</span>
                    <span className="text-right text-[#FBBF24]">Pending</span>
                  </div>
                  <div className="grid grid-cols-3 px-3 py-2 text-[#ECE8F5] items-center">
                    <span className="font-medium text-white truncate">Dave Okafor</span>
                    <span className="text-[#9E98AE] truncate">Workshop Day</span>
                    <span className="text-right text-[#34D399]">Checked in</span>
                  </div>
                </div>
              </div>

              {/* Bot response */}
              <div className="flex items-start gap-2 pt-1 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shrink-0 text-[10px]">
                  ✓
                </div>
                <p className="text-[11px] leading-relaxed text-[#C7C3D6]">
                  Approved. Dave Murphy’s Alan Turing Lab #4 pass is confirmed and emailed to d.murphy@campus.edu.
                </p>
              </div>

              {/* Prompt bar */}
              <div className="pt-2 flex items-center gap-2 border-t border-[#262135]">
                <input
                  type="text"
                  readOnly
                  value="Ask about faculty office hours or lab reservations..."
                  className="bg-transparent text-[11px] text-[#716B82] w-full focus:outline-none cursor-default"
                />
                <button className="w-6 h-6 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          § 01 · IN THE APP / DOOR CHECK-IN SIMULATOR
          (Mirrors media_1794928849151_1778e9b1.jpg)
         ======================================================== */}
      <section id="door-checkin" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-[#262135]">
        {/* Section Header */}
        <div className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-[#A78BFA] mb-3">
            § 01 · IN THE APP
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            See it work before you sign up
          </h2>
          <p className="text-sm sm:text-base text-[#9E98AE] max-w-xl">
            Every frame is a live workflow: working the door, preventing room conflicts, building the faculty schedule.
          </p>
        </div>

        {/* 2-Column: Left Text Description + Right Interactive Phone Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono uppercase tracking-widest text-[#716B82]">
              AT THE CAMPUS GATE
            </div>
            <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              What your door staff actually see
            </h3>
            <p className="text-sm sm:text-base text-[#9E98AE] leading-relaxed">
              You send them a link and that is the whole setup — no install, no account, no seat to pay for.
              Camera scan, student barcode reader, or search a name and tap.
            </p>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#C7C3D6] pt-2">
              <li className="flex items-start gap-3">
                <span className="text-[#34D399] font-bold">✓</span>
                <span>Every device works from the same live list, so no ticket gets in twice</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#34D399] font-bold">✓</span>
                <span>Undo a check-in in one tap if a student steps out</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#34D399] font-bold">✓</span>
                <span>A separate list per entrance door or lab room, each with its own live counter</span>
              </li>
            </ul>

            <div className="pt-4 flex items-center gap-3">
              <span className="text-xs text-[#716B82] font-mono">Try it live:</span>
              <span className="text-xs text-[#A78BFA] bg-[#7C3AED]/15 px-3 py-1 rounded-full border border-[#7C3AED]/30">
                Click "Check in" or "Check out" on the phone →
              </span>
            </div>
          </div>

          {/* Right Column: High-Contrast White Phone Device Frame */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md rounded-[38px] p-3.5 bg-[#1B1828] border-2 border-[#37304E] shadow-[0_30px_100px_rgba(0,0,0,0.9)]">
              {/* Phone White Canvas */}
              <div className="rounded-[28px] bg-white text-slate-900 p-5 overflow-hidden shadow-inner font-sans">
                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 tracking-tight">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">CHECK-IN</span>
                    <span>Front door</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    <span>{checkedInCount}/{attendees.length}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mt-3.5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={doorSearch}
                    onChange={(e) => setDoorSearch(e.target.value)}
                    placeholder="Search by name, roll #, ticket or email"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* 2 Big Counters (Checked In & Remaining) */}
                <div className="grid grid-cols-2 gap-3 mt-3.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                    <div className="text-xl font-black text-slate-900 tracking-tight">
                      {checkedInCount}<span className="text-xs font-normal text-slate-400">/{attendees.length}</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      CHECKED IN
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                    <div className="text-xl font-black text-slate-900 tracking-tight">
                      {remainingCount}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      REMAINING
                    </div>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 mt-3.5 pb-2">
                  <button
                    onClick={() => setDoorFilter('all')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      doorFilter === 'all'
                        ? 'bg-[#7C3AED] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All {attendees.length}
                  </button>
                  <button
                    onClick={() => setDoorFilter('remaining')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      doorFilter === 'remaining'
                        ? 'bg-[#7C3AED] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Remaining {remainingCount}
                  </button>
                  <button
                    onClick={() => setDoorFilter('checked_in')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      doorFilter === 'checked_in'
                        ? 'bg-[#7C3AED] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Checked in {checkedInCount}
                  </button>
                </div>

                {/* Attendee Live List with Interactive Buttons */}
                <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {filteredAttendees.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-white shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            a.checkedIn
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {a.checkedIn ? '✓' : a.name.charAt(0)}
                        </div>
                        <div className="truncate text-left">
                          <p className="text-xs font-bold text-slate-900 truncate tracking-tight">
                            {a.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                            {a.code} • {a.type}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Toggle Button */}
                      <button
                        onClick={() => toggleCheckIn(a.id)}
                        className={`ml-2 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          a.checkedIn
                            ? 'bg-[#EF4444] hover:bg-rose-600 text-white shadow-sm'
                            : 'bg-[#10B981] hover:bg-emerald-600 text-white shadow-sm'
                        }`}
                      >
                        {a.checkedIn ? 'Check out' : 'Check in'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          § 02 · RESERVED SEATING & BOX OFFICE
          (Mirrors media_1794928849156_ddacb0ee.jpg)
         ======================================================== */}
      <section id="seating" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-[#262135]">
        <div className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-[#A78BFA] mb-3">
            § 02 · RESERVED SEATING & DESK
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Interactive seat maps & door desk
          </h2>
          <p className="text-sm sm:text-base text-[#9E98AE] max-w-xl">
            Let students pick their exact workstations, seminar seats, or lab benches with real-time collision locks.
          </p>
        </div>

        {/* 2 Big Bento Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Reserved Seating */}
          <div className="rounded-2xl bg-[#0D0C15] border border-[#262135] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C4B5FD] text-[10px] font-bold tracking-wider uppercase mb-4">
                NEW Reserved seating
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
                Students pick their own seats.
              </h3>
              <p className="text-xs sm:text-sm text-[#9E98AE] leading-relaxed mb-6">
                Draw your auditorium or lab once and categorize by workstation tier. The row and bench number go on every pass.
              </p>
            </div>

            {/* Interactive Seat Selector Mockup */}
            <div className="rounded-xl bg-[#13111C] border border-[#262135] p-4 text-center">
              {/* Browser bar */}
              <div className="text-[10px] font-mono text-[#716B82] bg-[#0D0C15] px-3 py-1.5 rounded-lg border border-[#262135] mb-4 text-left truncate">
                app.campusconnect.edu/event/11899/amphitheater
              </div>

              {/* Stage */}
              <div className="w-2/3 mx-auto py-1.5 rounded-md bg-[#7C3AED]/30 border border-[#7C3AED]/50 text-[10px] font-mono text-[#C4B5FD] uppercase tracking-widest mb-6">
                STAGE / PODIUM
              </div>

              {/* Seat Matrix */}
              <div className="grid grid-cols-6 gap-2.5 max-w-xs mx-auto mb-4">
                {seats.map((seat) => {
                  const isSelected = selectedSeat === seat.id;
                  const isOccupied = seat.status === 'occupied';

                  return (
                    <button
                      key={seat.id}
                      disabled={isOccupied}
                      onClick={() => setSelectedSeat(seat.id)}
                      className={`h-7 rounded-md text-[10px] font-mono font-bold transition-all ${
                        isOccupied
                          ? 'bg-[#262135] text-[#716B82] cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#7C3AED] text-white shadow-[0_0_12px_rgba(124,58,237,0.7)] ring-2 ring-white/20'
                          : 'bg-[#1B1828] text-[#C7C3D6] hover:bg-[#262135] cursor-pointer'
                      }`}
                      title={isOccupied ? `${seat.id} (Occupied)` : `${seat.id} (Click to select)`}
                    >
                      {seat.id}
                    </button>
                  );
                })}
              </div>

              {/* Legend & Selected */}
              <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#262135] text-[#9E98AE]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-[#1B1828] border border-[#262135]" /> Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-[#7C3AED]" /> Selected
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-[#262135]" /> Occupied
                  </span>
                </div>
                <span className="text-[#34D399] font-bold font-mono">Seat {selectedSeat}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Box Office & Verification */}
          <div className="rounded-2xl bg-[#0D0C15] border border-[#262135] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C4B5FD] text-[10px] font-bold tracking-wider uppercase mb-4">
                NEW Box office
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
                Sell at the door. Tap to verify.
              </h3>
              <p className="text-xs sm:text-sm text-[#9E98AE] leading-relaxed mb-6">
                A link and a PIN for your student volunteer desk. Verify RFID campus cards or process student activity fee tokens in one instant tap.
              </p>
            </div>

            {/* Door Desk Card Mockup */}
            <div className="rounded-xl bg-[#13111C] border border-[#262135] p-4 space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#262135]">
                <span className="font-semibold text-white">Campus Box Office #01</span>
                <span className="text-[10px] font-mono text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded">
                  ONLINE
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0C15] border border-[#262135] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#716B82]">TRANSACTION BALANCE</div>
                  <div className="text-2xl font-black text-white font-mono mt-0.5">₹4,210.00</div>
                  <div className="text-[10px] text-[#34D399] flex items-center gap-1 mt-1 font-mono">
                    <span>● Verified via Campus Pay</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA] shadow-inner">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  Print Gate Badge
                </button>
                <button className="px-4 py-2 rounded-xl bg-[#1B1828] text-[#9E98AE] hover:text-white text-xs font-semibold">
                  Scan QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          § 03 · EVERY CAMPUS BOOKING FEATURE, INCLUDED
          (Mirrors media_1794928849157_15ff2710.jpg)
         ======================================================== */}
      <section id="features" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-[#262135]">
        <div className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-[#A78BFA] mb-3">
            § 03 · INCLUDED FEATURES
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Every campus booking feature, included
          </h2>
          <p className="text-sm sm:text-base text-[#9E98AE] max-w-xl">
            Everything here comes with every institutional account, with no higher tier to upgrade to.
            Reserved seating, a box office and single sign-on are ready on day one.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bento 1: Real-time Ledger */}
          <div className="rounded-2xl bg-[#0D0C15] border border-[#262135] p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-bold text-lg text-white mb-2">
                Real-time audit records
              </h4>
              <p className="text-xs text-[#9E98AE] leading-relaxed mb-6">
                Department activity records land in your administrative ledger as students book, not weeks after the semester ends.
              </p>
            </div>
            {/* Payout Pills */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white text-slate-900 text-xs font-medium flex items-center justify-between shadow-md">
                <span className="text-slate-500 font-mono text-[11px]">May 22 session count</span>
                <span className="font-bold font-mono">148 Bookings • Recorded</span>
              </div>
              <div className="p-4 rounded-xl bg-white text-slate-900 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
                  <span>FACULTY HOURS CLEARED</span>
                  <span className="text-emerald-600 font-bold">● Live Sync</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">420.5 hrs</div>
                <div className="text-[11px] text-slate-500 mt-1">Exported to Dean Registry</div>
              </div>
            </div>
          </div>

          {/* Bento 2: Interactive Color Picker Pass Customizer */}
          <div className="rounded-2xl bg-[#0D0C15] border border-[#262135] p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-bold text-lg text-white mb-2">
                Your brand on check-in passes
              </h4>
              <p className="text-xs text-[#9E98AE] leading-relaxed mb-4">
                Pick a color. Your registration forms, buttons and the passes students receive all follow your department identity.
              </p>

              {/* Color Swatches */}
              <div className="flex items-center gap-3 mb-6">
                {colorOptions.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setBrandColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-all cursor-pointer ${
                      brandColor === c.hex ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
                <span className="text-xs font-mono text-[#716B82] ml-1">{brandColor}</span>
              </div>
            </div>

            {/* Live Pass Preview modified by Color Picker */}
            <div className="rounded-xl overflow-hidden bg-white text-slate-900 shadow-md">
              <div style={{ backgroundColor: brandColor }} className="p-3 text-white transition-colors duration-300">
                <div className="text-xs font-bold tracking-tight">HackFest 2026 Campus Pass</div>
                <div className="text-[10px] opacity-80">Computer Science & AI Society</div>
              </div>
              <div className="p-3 text-xs space-y-2">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Admit Tier:</span>
                  <span className="font-semibold text-slate-800">Full Delegate Pass</span>
                </div>
                <button
                  style={{ backgroundColor: brandColor }}
                  className="w-full py-1.5 rounded-lg text-white text-xs font-bold transition-colors duration-300 cursor-pointer shadow-xs"
                >
                  Download Pass • Free
                </button>
              </div>
            </div>
          </div>

          {/* Bento 3: Faculty Doubt Clearing */}
          <div className="rounded-2xl bg-[#0D0C15] border border-[#262135] p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-bold text-lg text-white mb-2">
                Faculty office hours & doubt clearing
              </h4>
              <p className="text-xs text-[#9E98AE] leading-relaxed mb-6">
                Professors configure recurring weekly availability windows, block exam preparation blackout days, and approve 1-on-1 mentorship with full student query context.
              </p>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#13111C] border border-[#262135] flex items-center justify-between text-[#C7C3D6]">
                <span>Dr. Sarah Jenkins</span>
                <span className="text-[#34D399]">Mon 2:00 PM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#13111C] border border-[#262135] flex items-center justify-between text-[#C7C3D6]">
                <span>Prof. Robert Lang</span>
                <span className="text-[#A78BFA]">Wed 10:30 AM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#13111C] border border-[#262135] flex items-center justify-between text-[#C7C3D6]">
                <span>Dr. Michael Chang</span>
                <span className="text-[#FBBF24]">Fri 4:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          § 04 · OPEN ARCHITECTURE / PLATFORM SPECS
          (Mirrors media_1794928849155_253eb128.jpg)
         ======================================================== */}
      <section id="architecture" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-[#262135]">
        <div className="rounded-3xl bg-[#0D0C15] border border-[#262135] p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {/* Subtle Top Glow */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-60" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#A78BFA]">
                § 04 · PLATFORM SPECS & OPEN ARCHITECTURE
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Open architecture, so you're never locked in
              </h2>
              <p className="text-sm sm:text-base text-[#9E98AE] leading-relaxed">
                Every line of code is clean MERN stack and every student reservation record is yours — exportable at any time, never sold.
                If you ever need to take the whole thing in-house, you can: it runs standalone on Node.js and MongoDB, ready for university intranet deployment.
              </p>

              <div className="pt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
                  Star on GitHub
                </a>
              </div>
            </div>

            {/* Right 4-Box Metric Grid */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#13111C] border border-[#262135]">
                  <div className="text-3xl font-black text-white font-mono tracking-tight">0%</div>
                  <div className="text-xs font-semibold text-[#C7C3D6] mt-1">Schedule Collisions</div>
                  <div className="text-[10px] text-[#716B82] mt-0.5">Automated overlap locks</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#13111C] border border-[#262135]">
                  <div className="text-3xl font-black text-white font-mono tracking-tight">98.4%</div>
                  <div className="text-xs font-semibold text-[#C7C3D6] mt-1">Approval Velocity</div>
                  <div className="text-[10px] text-[#716B82] mt-0.5">Instant faculty turnaround</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#13111C] border border-[#262135]">
                  <div className="text-3xl font-black text-white font-mono tracking-tight">1-Tap</div>
                  <div className="text-xs font-semibold text-[#C7C3D6] mt-1">Gate Verification</div>
                  <div className="text-[10px] text-[#716B82] mt-0.5">Mobile door staff desk</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#13111C] border border-[#262135]">
                  <div className="text-3xl font-black text-white font-mono tracking-tight">RBAC 3.0</div>
                  <div className="text-xs font-semibold text-[#C7C3D6] mt-1">Security Architecture</div>
                  <div className="text-[10px] text-[#716B82] mt-0.5">Student, Faculty, Dean roles</div>
                </div>
              </div>

              {/* Security Pill */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#13111C]/60 border border-[#262135] flex items-center gap-2.5 text-xs text-[#9E98AE]">
                <Lock className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span>No vendor lock-in. Export MongoDB records as CSV any time, run behind campus firewalls.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FAST-TRACK ROLE ACCELERATOR SECTION
         ======================================================== */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto w-full text-center">
        <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-4">
          Ready to experience your new campus portal?
        </h3>
        <p className="text-xs sm:text-sm text-[#9E98AE] mb-8 max-w-md mx-auto">
          Choose your role to test drive the live portal instantly with pre-seeded data.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login?role=student"
            className="px-5 py-2.5 rounded-xl bg-[#13111C] border border-[#262135] hover:border-[#7C3AED] text-white text-xs sm:text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-[#8B5CF6]" />
            Student Portal
          </Link>
          <Link
            to="/login?role=faculty"
            className="px-5 py-2.5 rounded-xl bg-[#13111C] border border-[#262135] hover:border-[#7C3AED] text-white text-xs sm:text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-[#8B5CF6]" />
            Faculty Portal
          </Link>
          <Link
            to="/login?role=admin"
            className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Executive Admin & Analytics
          </Link>
        </div>
      </section>

      {/* ========================================================
          FOOTER (hi.events style)
         ======================================================== */}
      <footer className="border-t border-[#262135] bg-[#08070D] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#716B82]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              CC
            </div>
            <span className="font-display font-bold text-white tracking-tight">
              CAMPUS<span className="text-[#8B5CF6]">.CONNECT</span>
            </span>
            <span className="text-[#37304E]">·</span>
            <span>Enterprise Academic Booking & Analytics OS</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#door-checkin" className="hover:text-white transition-colors">Door App</a>
            <a href="#seating" className="hover:text-white transition-colors">Seat Maps</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <Link to="/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="text-[#A78BFA] hover:text-white transition-colors font-semibold">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
