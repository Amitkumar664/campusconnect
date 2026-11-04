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
          { name: 'Profile & Settings', path: '/student/profile', icon: Settings }
        ];
      case 'faculty':
        return [
          { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
          { name: 'Session Requests', path: '/faculty/requests', icon: ClipboardList },
          { name: 'Office Hours & Schedule', path: '/faculty/availability', icon: Clock },
          { name: 'Session History', path: '/faculty/history', icon: BookOpen },
          { name: 'Profile & Settings', path: '/faculty/profile', icon: Settings }
        ];
      case 'admin':
        return [
          { name: 'Business Analytics', path: '/admin/analytics', icon: BarChart3, highlight: true },
          { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Master Bookings', path: '/admin/bookings', icon: CalendarCheck },
          { name: 'Campus Resources', path: '/admin/resources', icon: Building2 },
          { name: 'Event Management', path: '/admin/events', icon: Calendar },
          { name: 'User Directory', path: '/admin/users', icon: Users },
          { name: 'Settings', path: '/admin/profile', icon: Settings }
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
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#080D0C]/90 backdrop-blur-2xl border-r border-white/[0.07] transition-all duration-300 shadow-[4px_0_30px_rgba(0,0,0,0.6)] ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/[0.07]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-[1px] shadow-glow flex-shrink-0">
              <div className="w-full h-full bg-[#080D0C] rounded-2xl flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                  Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Connect</span>
                </span>
                <span className="text-[10px] text-campus-textSubtle uppercase tracking-widest font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Enterprise OS
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl text-campus-textSubtle hover:text-white hover:bg-white/[0.06] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Pill Banner */}
        {!isCollapsed && (
          <div className="mx-4 mt-4 px-3.5 py-2.5 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex items-center justify-between shadow-inner-bevel">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-white capitalize tracking-wide">
                {user?.role} Portal
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-medium">
              Active
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
                    : 'text-campus-textMuted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {/* Framer Motion Layout Pill for smooth sliding active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-teal-500/5 border border-emerald-500/30 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]"
                  />
                )}

                <div
                  className={`relative z-10 transition-transform group-hover:scale-110 duration-200 ${
                    isActive ? 'text-emerald-400' : 'text-campus-textSubtle group-hover:text-campus-text'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                </div>

                {!isCollapsed && (
                  <span className="relative z-10 truncate tracking-tight">{link.name}</span>
                )}

                {link.highlight && !isCollapsed && (
                  <span className="relative z-10 ml-auto px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                    Live
                  </span>
                )}

                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#0F1614] border border-white/10 text-xs text-white whitespace-nowrap shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                    {link.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-white/[0.07] bg-[#070A09]/60">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] shadow-glass hover:border-emerald-500/30 transition-all">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-campus-bg font-bold flex items-center justify-center flex-shrink-0 text-sm shadow-glow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080D0C]" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate tracking-tight">
                  {user?.fullName}
                </p>
                <p className="text-[10px] text-campus-textSubtle truncate font-mono">
                  {user?.department}
                </p>
              </div>
            )}

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-xl text-campus-textSubtle hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-auto flex-shrink-0 cursor-pointer"
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
