import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Code2,
  Trophy,
  Video,
  Ticket,
  CalendarCheck,
  BarChart3,
  QrCode,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'AI Analytics', path: '/admin/analytics', icon: BarChart3, badge: 'Soon' },
        { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Event Management', path: '/admin/events', icon: Calendar },
        { name: 'Hackathon Desk', path: '/admin/hackathons', icon: Code2 },
        { name: 'Sports Tournaments', path: '/admin/sports', icon: Trophy },
        { name: 'Door Check-In Desk', path: '/admin/ticket-verification', icon: QrCode, badge: 'Soon' },
        { name: 'Master Bookings', path: '/admin/bookings', icon: Ticket },
        { name: 'User Directory', path: '/admin/users', icon: Users },
        { name: 'Broadcasts & Notices', path: '/admin/notifications', icon: Bell },
        { name: 'Account Settings', path: '/profile', icon: Settings }
      ];
    }

    // Default: Student Portal
    return [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Explore Events', path: '/student/events', icon: Compass },
      { name: 'Hackathon Hub', path: '/student/hackathons', icon: Code2 },
      { name: 'Sports Hub', path: '/student/sports', icon: Trophy },
      { name: 'Virtual Events', path: '/student/virtual', icon: Video },
      { name: 'My Bookings', path: '/student/my-bookings', icon: CalendarCheck },
      { name: 'My Digital Tickets', path: '/student/my-tickets', icon: Ticket, highlight: true },
      { name: 'Profile & Settings', path: '/profile', icon: Settings }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0F172A] border-r border-[#1E293B] transition-all duration-300 shadow-[6px_0_30px_rgba(0,0,0,0.5)] ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#387ED1] to-[#2563EB] flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,126,209,0.5)] flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
                  CAMPUS<span className="text-[#387ED1]">CONNECT</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#64748B] font-semibold">
                  {user?.role === 'admin' ? 'Admin Suite' : 'Student Portal'}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-[#1E293B] hover:bg-[#387ED1]/20 hover:text-[#387ED1] text-[#94A3B8] items-center justify-center transition-all border border-[#334155]"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#387ED1] to-[#2563EB] text-white shadow-[0_4px_16px_rgba(56,126,209,0.35)]'
                    : link.highlight
                    ? 'text-[#60A5FA] bg-[#1E293B]/70 hover:bg-[#1E293B] hover:text-white border border-[#387ED1]/30'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/80'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : link.highlight ? 'text-[#387ED1]' : 'text-[#64748B] group-hover:text-[#60A5FA]'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1 tracking-tight">{link.name}</span>
                )}
                {!isCollapsed && link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                    {link.badge}
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="fixed left-24 px-3 py-1.5 bg-[#1E293B] text-white text-xs rounded-md shadow-xl border border-[#334155] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {link.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0B0F19]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#1E293B]/60 border border-[#334155]/60 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#387ED1] text-white font-bold text-sm flex items-center justify-center shadow-[0_0_12px_rgba(56,126,209,0.4)] flex-shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-white truncate tracking-tight">
                  {user?.fullName}
                </span>
                <span className="text-[10px] text-[#60A5FA] font-mono uppercase tracking-wider font-semibold">
                  {user?.role}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors group"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
