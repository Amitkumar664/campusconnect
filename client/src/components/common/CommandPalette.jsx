import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Building2,
  GraduationCap,
  BarChart3,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Available commands based on role
  const getCommands = () => {
    const common = [
      {
        id: 'profile',
        title: 'Account Settings & Profile',
        category: 'Navigation',
        icon: Settings,
        action: () => navigate('/profile')
      },
      {
        id: 'logout',
        title: 'Log out of CampusConnect',
        category: 'Account',
        icon: LogOut,
        action: () => logout()
      }
    ];

    if (!user) return common;

    if (user.role === 'student') {
      return [
        {
          id: 'student-dash',
          title: 'Student Dashboard',
          category: 'Navigation',
          icon: Sparkles,
          action: () => navigate('/student/dashboard')
        },
        {
          id: 'book-faculty',
          title: 'Book Faculty Doubt Clearing Session',
          category: 'Actions',
          icon: GraduationCap,
          action: () => navigate('/student/book-faculty')
        },
        {
          id: 'book-resource',
          title: 'Reserve Classroom, Amphitheater or Lab',
          category: 'Actions',
          icon: Building2,
          action: () => navigate('/student/book-resource')
        },
        {
          id: 'browse-events',
          title: 'Browse Upcoming College Events & Hackathons',
          category: 'Actions',
          icon: Calendar,
          action: () => navigate('/student/events')
        },
        {
          id: 'my-bookings',
          title: 'My Bookings & Session History',
          category: 'Navigation',
          icon: CalendarCheck,
          action: () => navigate('/student/bookings')
        },
        ...common
      ];
    }

    if (user.role === 'faculty') {
      return [
        {
          id: 'faculty-dash',
          title: 'Faculty Mentorship Dashboard',
          category: 'Navigation',
          icon: Sparkles,
          action: () => navigate('/faculty/dashboard')
        },
        {
          id: 'faculty-requests',
          title: 'Review Pending Student Doubt Requests',
          category: 'Actions',
          icon: GraduationCap,
          action: () => navigate('/faculty/requests')
        },
        {
          id: 'faculty-availability',
          title: 'Configure Office Hours & Block Dates',
          category: 'Actions',
          icon: CalendarCheck,
          action: () => navigate('/faculty/availability')
        },
        {
          id: 'faculty-history',
          title: 'Past Mentorship Session History',
          category: 'Navigation',
          icon: Calendar,
          action: () => navigate('/faculty/history')
        },
        ...common
      ];
    }

    if (user.role === 'admin') {
      return [
        {
          id: 'admin-dash',
          title: 'Administrator Operations Command',
          category: 'Navigation',
          icon: Sparkles,
          action: () => navigate('/admin/dashboard')
        },
        {
          id: 'admin-analytics',
          title: 'Business Analytics & MongoDB Metrics Engine',
          category: 'Actions',
          icon: BarChart3,
          action: () => navigate('/admin/analytics')
        },
        {
          id: 'admin-bookings',
          title: 'Master Campus Booking Approvals & Overrides',
          category: 'Actions',
          icon: CalendarCheck,
          action: () => navigate('/admin/bookings')
        },
        {
          id: 'admin-resources',
          title: 'Manage Campus Labs, Classrooms & Auditoriums',
          category: 'Management',
          icon: Building2,
          action: () => navigate('/admin/resources')
        },
        {
          id: 'admin-events',
          title: 'Publish College Hackathons & Symposia',
          category: 'Management',
          icon: Calendar,
          action: () => navigate('/admin/events')
        },
        {
          id: 'admin-users',
          title: 'University User Directory & Role Assignment',
          category: 'Management',
          icon: Users,
          action: () => navigate('/admin/users')
        },
        ...common
      ];
    }

    return common;
  };

  const allCommands = getCommands();
  const filteredCommands = allCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Input bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="w-5 h-5 text-[#387ED1] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, page name, or quick action..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-500">
                <Command className="w-2.5 h-2.5" /> ESC
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching command or destination found for "{query}".
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-[#EBF3FC] text-[#387ED1] border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#387ED1] text-white font-bold'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium truncate">{cmd.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {cmd.category}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#387ED1]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer tip */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Navigate with <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↑</kbd> <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↓</kbd></span>
              <span>Press <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↵</kbd> to execute</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;

