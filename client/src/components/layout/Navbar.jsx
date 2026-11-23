import React from 'react';
import { Menu, Search, Calendar, ShieldCheck, Command } from 'lucide-react';
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
    <header className="h-20 px-4 sm:px-8 border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      {/* Left: Mobile hamburger & live date/system status */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/5 border border-[#1E293B] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live system health beacon */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs text-[#94A3B8] bg-[#111827] px-3.5 py-2 rounded-xl border border-[#1E293B] shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="font-semibold text-white">{currentDate}</span>
          <span className="text-[#334155]">•</span>
          <span className="text-[11px] text-[#64748B] font-mono">Campus Events 2.0</span>
        </div>
      </div>

      {/* Middle/Right: Quick Search Pill & Notification Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search Trigger Pill */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 text-xs text-[#94A3B8] bg-[#111827] px-3.5 py-2 rounded-xl border border-[#1E293B] hover:border-[#387ED1]/60 hover:text-white transition-all cursor-pointer shadow-inner group"
        >
          <Search className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#60A5FA] transition-colors" />
          <span className="group-hover:text-white transition-colors">Quick search events & tickets...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#1E293B] border border-[#334155] rounded-md shadow-sm">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Role badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#387ED1]/15 border border-[#387ED1]/30 text-xs shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
          <span className="text-[#94A3B8]">Role:</span>
          <span className="font-bold text-[#60A5FA] capitalize tracking-wide">{user?.role}</span>
        </div>

        {/* In-app Notification Dropdown */}
        <NotificationDropdown />

        {/* User initials bubble with halo */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#1E293B]">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#387ED1] to-[#2563EB] text-white font-extrabold text-sm flex items-center justify-center shadow-[0_0_12px_rgba(56,126,209,0.4)]">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0B0F19]" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px] tracking-tight">
              {user?.fullName}
            </p>
            <p className="text-[10px] text-[#60A5FA] font-mono font-medium uppercase tracking-wider mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
