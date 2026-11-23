import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Code2,
  Trophy,
  Video,
  Ticket,
  BarChart3,
  QrCode,
  Users,
  Settings,
  LogOut,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const getCommands = () => {
    const common = [
      {
        id: 'profile',
        title: 'Account Settings & Profile',
        category: 'Account',
        icon: Settings,
        action: () => navigate('/profile')
      },
      {
        id: 'logout',
        title: 'Sign Out of CampusConnect',
        category: 'Account',
        icon: LogOut,
        action: () => logout()
      }
    ];

    if (!user) return common;

    if (user.role === 'admin') {
      return [
        {
          id: 'admin-analytics',
          title: 'AI Analytics & Registration Predictions',
          category: 'Admin Intelligence',
          icon: BarChart3,
          action: () => navigate('/admin/analytics')
        },
        {
          id: 'admin-door',
          title: 'Door Staff Ticket Check-In Desk',
          category: 'Verification',
          icon: QrCode,
          action: () => navigate('/admin/ticket-verification')
        },
        {
          id: 'admin-events',
          title: 'Manage Campus Events & Publishing',
          category: 'Management',
          icon: Calendar,
          action: () => navigate('/admin/events')
        },
        {
          id: 'admin-hackathons',
          title: 'Manage Hackathons & Submissions',
          category: 'Management',
          icon: Code2,
          action: () => navigate('/admin/hackathons')
        },
        {
          id: 'admin-sports',
          title: 'Manage Sports Tournaments & Scores',
          category: 'Management',
          icon: Trophy,
          action: () => navigate('/admin/sports')
        },
        {
          id: 'admin-bookings',
          title: 'Master Ticket Bookings & CSV Export',
          category: 'Management',
          icon: Ticket,
          action: () => navigate('/admin/bookings')
        },
        {
          id: 'admin-users',
          title: 'User Administration Directory',
          category: 'Management',
          icon: Users,
          action: () => navigate('/admin/users')
        },
        ...common
      ];
    }

    // Student commands
    return [
      {
        id: 'student-dash',
        title: 'Student Dashboard',
        category: 'Navigation',
        icon: Compass,
        action: () => navigate('/student/dashboard')
      },
      {
        id: 'browse-events',
        title: 'Explore College Events & Workshops',
        category: 'Explore',
        icon: Calendar,
        action: () => navigate('/student/events')
      },
      {
        id: 'student-hackathons',
        title: 'Hackathons Hub & Team Formation',
        category: 'Explore',
        icon: Code2,
        action: () => navigate('/student/hackathons')
      },
      {
        id: 'student-sports',
        title: 'Sports Tournaments & Match Brackets',
        category: 'Explore',
        icon: Trophy,
        action: () => navigate('/student/sports')
      },
      {
        id: 'student-virtual',
        title: 'Virtual Webinars & Meeting Access',
        category: 'Explore',
        icon: Video,
        action: () => navigate('/student/virtual')
      },
      {
        id: 'my-tickets',
        title: 'My Digital Tickets & QR Wallet',
        category: 'Tickets',
        icon: Ticket,
        action: () => navigate('/student/my-tickets')
      },
      {
        id: 'my-bookings',
        title: 'Registration History & Bookings',
        category: 'Tickets',
        icon: Calendar,
        action: () => navigate('/student/my-bookings')
      },
      ...common
    ];
  };

  const allCommands = getCommands();
  const filteredCommands = query
    ? allCommands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-xl bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-[#1E293B]">
            <Search className="w-5 h-5 text-[#387ED1] mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search actions, events, tickets, analytics..."
              className="w-full bg-transparent text-sm text-white placeholder-[#64748B] focus:outline-none"
            />
            <span className="text-[11px] font-mono text-[#64748B] bg-[#1E293B] px-2 py-0.5 rounded border border-[#334155]">
              ESC
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#64748B]">
                No matching results found for "{query}"
              </div>
            ) : (
              filteredCommands.map((command, idx) => {
                const Icon = command.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={command.id}
                    onClick={() => {
                      command.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-all ${
                      isSelected
                        ? 'bg-[#387ED1] text-white shadow-md'
                        : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#64748B]'}`} />
                      <span className="font-medium">{command.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#1E293B] text-[#64748B]'
                      }`}>
                        {command.category}
                      </span>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
