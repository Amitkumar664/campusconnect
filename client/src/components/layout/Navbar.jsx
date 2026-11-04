import React from 'react';
import { Menu, Search, Calendar, ShieldCheck } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onOpenMobileSidebar }) => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-18 px-4 sm:px-8 border-b border-campus-border bg-campus-bg/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-campus-textMuted hover:text-campus-text hover:bg-white/5 border border-campus-border"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-campus-textMuted bg-campus-card px-3 py-1.5 rounded-xl border border-campus-border">
          <Calendar className="w-3.5 h-3.5 text-campus-primary" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Right: Quick system status, Notification center, User badge */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-campus-card border border-campus-border text-xs">
          <ShieldCheck className="w-4 h-4 text-campus-primary" />
          <span className="text-campus-textSubtle">Role:</span>
          <span className="font-semibold text-campus-text capitalize">{user?.role}</span>
        </div>

        {/* In-app Notification Dropdown */}
        <NotificationDropdown />

        {/* User initials bubble */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-campus-border">
          <div className="w-9 h-9 rounded-xl bg-campus-primary/10 border border-campus-primary/30 flex items-center justify-center text-campus-primary font-bold text-sm shadow-glow">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-campus-text leading-tight truncate max-w-[120px]">
              {user?.fullName}
            </p>
            <p className="text-[10px] text-campus-primary font-medium uppercase tracking-wider">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

