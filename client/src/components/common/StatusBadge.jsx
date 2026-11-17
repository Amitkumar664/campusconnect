import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const normStatus = (status || '').toLowerCase();

  const configs = {
    approved: {
      label: 'Approved',
      bg: 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30',
      dot: 'bg-[#10B981]',
      ping: true
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30',
      dot: 'bg-[#10B981]',
      ping: true
    },
    completed: {
      label: 'Completed',
      bg: 'bg-[#7C3AED]/20 text-[#A78BFA] border-[#7C3AED]/40',
      dot: 'bg-[#8B5CF6]',
      ping: false
    },
    pending: {
      label: 'Pending Review',
      bg: 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30',
      dot: 'bg-[#F59E0B]',
      ping: true
    },
    rejected: {
      label: 'Declined',
      bg: 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30',
      dot: 'bg-[#EF4444]',
      ping: false
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-[#262135]/60 text-[#9E98AE] border-[#37304E]',
      dot: 'bg-[#716B82]',
      ping: false
    },
    active: {
      label: 'Active',
      bg: 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30',
      dot: 'bg-[#10B981]',
      ping: true
    },
    inactive: {
      label: 'Inactive',
      bg: 'bg-[#262135]/60 text-[#9E98AE] border-[#37304E]',
      dot: 'bg-[#716B82]',
      ping: false
    },
    upcoming: {
      label: 'Upcoming',
      bg: 'bg-[#06B6D4]/15 text-[#38BDF8] border-[#06B6D4]/30',
      dot: 'bg-[#06B6D4]',
      ping: false
    }
  };

  const current = configs[normStatus] || {
    label: status || 'Unknown',
    bg: 'bg-[#262135]/60 text-[#9E98AE] border-[#37304E]',
    dot: 'bg-[#716B82]',
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
