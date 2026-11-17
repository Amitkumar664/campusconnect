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
    <header className="h-20 px-4 sm:px-8 border-b border-[#262135] bg-[#08070D]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      {/* Left: Mobile hamburger & live date/system status */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#9E98AE] hover:text-white hover:bg-white/5 border border-[#262135] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live system health beacon */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs text-[#9E98AE] bg-[#13111C] px-3.5 py-2 rounded-xl border border-[#262135] shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="font-semibold text-white">{currentDate}</span>
          <span className="text-[#37304E]">•</span>
          <span className="text-[11px] text-[#716B82] font-mono">Campus OS v2.0</span>
        </div>
      </div>

      {/* Middle/Right: Quick Search Pill & Notification Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search Trigger Pill */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 text-xs text-[#9E98AE] bg-[#13111C] px-3.5 py-2 rounded-xl border border-[#262135] hover:border-[#7C3AED]/60 hover:text-white transition-all cursor-pointer shadow-inner group"
        >
          <Search className="w-3.5 h-3.5 text-[#716B82] group-hover:text-[#A78BFA] transition-colors" />
          <span className="group-hover:text-white transition-colors">Quick search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#9E98AE] bg-[#1B1828] border border-[#262135] rounded-md shadow-sm">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Role badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#A78BFA]" />
          <span className="text-[#9E98AE]">Role:</span>
          <span className="font-bold text-[#A78BFA] capitalize tracking-wide">{user?.role}</span>
        </div>

        {/* In-app Notification Dropdown */}
        <NotificationDropdown />

        {/* User initials bubble with halo */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#262135]">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white font-extrabold text-sm flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.4)]">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#08070D]" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px] tracking-tight">
              {user?.fullName}
            </p>
            <p className="text-[10px] text-[#A78BFA] font-mono font-medium uppercase tracking-wider mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
