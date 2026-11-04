import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const normStatus = (status || '').toLowerCase();

  const configs = {
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      dot: 'bg-emerald-400'
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      dot: 'bg-emerald-400'
    },
    completed: {
      label: 'Completed',
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
      dot: 'bg-sky-400'
    },
    pending: {
      label: 'Pending Review',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      dot: 'bg-amber-400 animate-pulse'
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
      dot: 'bg-rose-400'
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/25',
      dot: 'bg-zinc-400'
    },
    active: {
      label: 'Active',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      dot: 'bg-emerald-400'
    },
    inactive: {
      label: 'Inactive',
      bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/25',
      dot: 'bg-zinc-400'
    },
    upcoming: {
      label: 'Upcoming',
      bg: 'bg-teal-500/10 text-teal-400 border-teal-500/25',
      dot: 'bg-teal-400'
    }
  };

  const current = configs[normStatus] || {
    label: status || 'Unknown',
    bg: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    dot: 'bg-gray-400'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-3 py-1 gap-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${current.bg} ${sizes[size] || sizes.md}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
};

export default StatusBadge;

