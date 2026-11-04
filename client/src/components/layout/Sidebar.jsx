import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-campus-surface border-r border-campus-border transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-campus-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-campus-primary/10 border border-campus-primary/30 flex items-center justify-center text-campus-primary shadow-glow flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-campus-text tracking-tight flex items-center gap-1.5">
                  Campus<span className="text-campus-primary">Connect</span>
                </span>
                <span className="text-[10px] text-campus-textSubtle uppercase tracking-widest font-mono">
                  Enterprise SaaS
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-campus-textSubtle hover:text-campus-text hover:bg-white/5 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Pill Banner */}
        {!isCollapsed && (
          <div className="mx-4 mt-4 px-3 py-2 rounded-xl bg-campus-card border border-campus-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-campus-primary animate-pulse" />
              <span className="text-xs font-semibold text-campus-text capitalize">
                {user?.role} Portal
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-campus-textMuted uppercase font-mono">
              v1.0
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-campus-primary text-campus-bg font-semibold shadow-glow'
                      : link.highlight
                      ? 'bg-campus-amber/10 text-campus-amber hover:bg-campus-amber/20 border border-campus-amber/30'
                      : 'text-campus-textMuted hover:text-campus-text hover:bg-white/5'
                  }`
                }
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110`} />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-campus-card border border-campus-border text-xs text-campus-text whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                    {link.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-campus-border bg-campus-surface/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-campus-card border border-campus-border/60">
            <div className="w-9 h-9 rounded-lg bg-campus-primary/20 text-campus-primary font-bold flex items-center justify-center flex-shrink-0 text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-campus-text truncate">
                  {user?.fullName}
                </p>
                <p className="text-[10px] text-campus-textMuted truncate">
                  {user?.department}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-campus-textSubtle hover:text-campus-danger hover:bg-rose-500/10 transition-colors ml-auto flex-shrink-0"
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

