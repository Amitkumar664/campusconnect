import React from 'react';
import { Menu, Search, Calendar, ShieldCheck, Sparkles, Command } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onOpenMobileSidebar, onOpenCommandPalette }) => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-20 px-4 sm:px-8 border-b border-white/[0.07] bg-[#070A09]/80 backdrop-blur-2xl sticky top-0 z-30 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      {/* Left: Mobile hamburger & live date/system status */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-campus-textMuted hover:text-white hover:bg-white/[0.06] border border-white/10 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live system health beacon */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs text-campus-textMuted bg-white/[0.03] px-3.5 py-2 rounded-2xl border border-white/[0.06] shadow-glass">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-medium text-white">{currentDate}</span>
          <span className="text-white/20">•</span>
          <span className="text-[11px] text-campus-textSubtle font-mono">Academic Term 2026</span>
        </div>
      </div>

      {/* Middle/Right: Quick Search Pill & Notification Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search Trigger Pill */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 text-xs text-campus-textSubtle bg-white/[0.03] px-3.5 py-2 rounded-2xl border border-white/[0.06] hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all cursor-pointer shadow-glass group"
        >
          <Search className="w-3.5 h-3.5 text-campus-textSubtle group-hover:text-emerald-400 transition-colors" />
          <span className="group-hover:text-campus-text transition-colors">Quick search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-campus-textSubtle bg-white/5 border border-white/10 rounded-md">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Role badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs shadow-glass">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-campus-textSubtle">Role:</span>
          <span className="font-semibold text-white capitalize tracking-wide">{user?.role}</span>
        </div>

        {/* In-app Notification Dropdown */}
        <NotificationDropdown />

        {/* User initials bubble with halo */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-campus-bg font-extrabold text-sm flex items-center justify-center shadow-glow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070A09]" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px] tracking-tight">
              {user?.fullName}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
