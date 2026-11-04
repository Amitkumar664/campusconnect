import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const normStatus = (status || '').toLowerCase();

  const configs = {
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      ping: true
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      ping: true
    },
    completed: {
      label: 'Completed',
      bg: 'bg-blue-50 text-[#387ED1] border-blue-200',
      dot: 'bg-[#387ED1]',
      ping: false
    },
    pending: {
      label: 'Pending Review',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      ping: true
    },
    rejected: {
      label: 'Declined',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-[#DF514C]',
      ping: false
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      ping: false
    },
    active: {
      label: 'Active',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      ping: true
    },
    inactive: {
      label: 'Inactive',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      ping: false
    },
    upcoming: {
      label: 'Upcoming',
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: 'bg-sky-500',
      ping: false
    }
  };

  const current = configs[normStatus] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    ping: false
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1.5 font-medium tracking-wide',
    md: 'text-xs px-3 py-1 gap-2 font-medium tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${current.bg} ${sizes[size] || sizes.md}`}
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
