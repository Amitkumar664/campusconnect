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
    <header className="h-20 px-4 sm:px-8 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      {/* Left: Mobile hamburger & live date/system status */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live system health beacon */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="font-semibold text-slate-700">{currentDate}</span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-400 font-mono">Academic Term 2026</span>
        </div>
      </div>

      {/* Middle/Right: Quick Search Pill & Notification Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search Trigger Pill */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-[#387ED1]/50 hover:bg-white transition-all cursor-pointer shadow-sm group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#387ED1] transition-colors" />
          <span className="group-hover:text-slate-800 transition-colors">Quick search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Role badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#387ED1]" />
          <span className="text-slate-500">Role:</span>
          <span className="font-bold text-[#387ED1] capitalize tracking-wide">{user?.role}</span>
        </div>

        {/* In-app Notification Dropdown */}
        <NotificationDropdown />

        {/* User initials bubble with halo */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#387ED1] text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px] tracking-tight">
              {user?.fullName}
            </p>
            <p className="text-[10px] text-[#387ED1] font-mono font-medium uppercase tracking-wider mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
