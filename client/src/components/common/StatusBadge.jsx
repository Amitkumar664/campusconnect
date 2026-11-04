import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const normStatus = (status || '').toLowerCase();

  const configs = {
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)]',
      dot: 'bg-emerald-400',
      ping: true
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)]',
      dot: 'bg-emerald-400',
      ping: true
    },
    completed: {
      label: 'Completed',
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30 shadow-[0_0_10px_-2px_rgba(56,189,248,0.25)]',
      dot: 'bg-sky-400',
      ping: false
    },
    pending: {
      label: 'Pending Review',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_-2px_rgba(245,158,11,0.25)]',
      dot: 'bg-amber-400',
      ping: true
    },
    rejected: {
      label: 'Declined',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_-2px_rgba(244,63,94,0.25)]',
      dot: 'bg-rose-400',
      ping: false
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
      dot: 'bg-zinc-400',
      ping: false
    },
    active: {
      label: 'Active',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      ping: true
    },
    inactive: {
      label: 'Inactive',
      bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
      dot: 'bg-zinc-400',
      ping: false
    },
    upcoming: {
      label: 'Upcoming',
      bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      dot: 'bg-teal-400',
      ping: false
    }
  };

  const current = configs[normStatus] || {
    label: status || 'Unknown',
    bg: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    dot: 'bg-gray-400',
    ping: false
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1.5 font-medium tracking-wide',
    md: 'text-xs px-3 py-1 gap-2 font-medium tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all ${current.bg} ${sizes[size] || sizes.md}`}
    >
      <span className="relative flex h-2 w-2">
        {current.ping && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}
        />
      </span>
      {current.label}
    </span>
  );
};

export default StatusBadge;
