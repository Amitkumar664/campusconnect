import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  Building2,
  Calendar,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ClipboardList,
  Clock,
  Sparkles,
  ShieldCheck
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
    switch (user?.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Faculty Doubts', path: '/student/book-faculty', icon: GraduationCap },
          { name: 'Room & Lab Booking', path: '/student/book-resource', icon: Building2 },
          { name: 'College Events', path: '/student/events', icon: Calendar },
          { name: 'My Schedule', path: '/student/my-bookings', icon: CalendarCheck },
          { name: 'Profile & Settings', path: '/profile', icon: Settings }
        ];
      case 'faculty':
        return [
          { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
          { name: 'Session Requests', path: '/faculty/requests', icon: ClipboardList },
          { name: 'Office Hours & Schedule', path: '/faculty/availability', icon: Clock },
          { name: 'Session History', path: '/faculty/history', icon: BookOpen },
          { name: 'Profile & Settings', path: '/profile', icon: Settings }
        ];
      case 'admin':
        return [
          { name: 'Business Analytics', path: '/admin/analytics', icon: BarChart3, highlight: true },
          { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Master Bookings', path: '/admin/bookings', icon: CalendarCheck },
          { name: 'Campus Resources', path: '/admin/resources', icon: Building2 },
          { name: 'Event Management', path: '/admin/events', icon: Calendar },
          { name: 'User Directory', path: '/admin/users', icon: Users },
          { name: 'Settings', path: '/profile', icon: Settings }
        ];
      default:
        return [];
    }
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
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0D0C15] border-r border-[#262135] transition-all duration-300 shadow-[5px_0_25px_rgba(0,0,0,0.5)] ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#262135] bg-[#0D0C15]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
                  CAMPUS<span className="text-[#8B5CF6]">.CONNECT</span>
                </span>
                <span className="text-[10px] text-[#716B82] uppercase tracking-widest font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Campus OS
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl text-[#716B82] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Pill Banner */}
        {!isCollapsed && (
          <div className="mx-4 mt-4 px-3.5 py-2 rounded-xl bg-[#13111C] border border-[#262135] flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </div>
              <span className="text-xs font-semibold text-[#ECE8F5] capitalize tracking-wide">
                {user?.role} Portal
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#A78BFA] font-mono font-medium">
              Live
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors group ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#9E98AE] hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Framer Motion Layout Pill for smooth sliding active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/50 shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                  />
                )}

                <div
                  className={`relative z-10 transition-transform group-hover:scale-110 duration-200 ${
                    isActive ? 'text-[#A78BFA]' : 'text-[#716B82] group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                </div>

                {!isCollapsed && (
                  <span className="relative z-10 truncate tracking-tight">{link.name}</span>
                )}

                {link.highlight && !isCollapsed && (
                  <span className="relative z-10 ml-auto px-2 py-0.5 rounded-full bg-[#7C3AED]/30 text-[#C4B5FD] border border-[#7C3AED]/50 text-[10px] font-semibold">
                    Realtime
                  </span>
                )}

                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#13111C] border border-[#262135] text-xs text-white whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                    {link.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-[#262135] bg-[#0D0C15]">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#13111C] border border-[#262135] hover:border-[#7C3AED]/40 transition-all">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white font-bold flex items-center justify-center flex-shrink-0 text-sm shadow-[0_0_12px_rgba(124,58,237,0.4)]">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0D0C15]" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate tracking-tight">
                  {user?.fullName}
                </p>
                <p className="text-[10px] text-[#716B82] truncate font-mono">
                  {user?.department}
                </p>
              </div>
            )}

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-xl text-[#716B82] hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-auto flex-shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
