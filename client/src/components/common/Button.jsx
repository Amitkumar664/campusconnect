import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#08070D] disabled:opacity-50 disabled:cursor-not-allowed select-none shine-sweep overflow-hidden cursor-pointer';

  const variants = {
    primary:
      'bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold shadow-[0_0_25px_-4px_rgba(124,58,237,0.5)] hover:shadow-[0_0_35px_-4px_rgba(124,58,237,0.7)] border-t border-white/20 focus:ring-[#7C3AED]',
    white:
      'bg-white hover:bg-slate-100 text-[#08070D] font-bold shadow-md focus:ring-white',
    secondary:
      'bg-white/[0.05] hover:bg-white/[0.09] text-white border border-white/10 hover:border-violet-500/40 shadow-sm focus:ring-[#7C3AED]',
    outline:
      'bg-transparent border border-[#7C3AED] text-[#A78BFA] hover:bg-violet-500/10 focus:ring-[#7C3AED]',
    emerald:
      'bg-[#10B981] hover:bg-[#059669] text-white font-semibold shadow-sm focus:ring-[#10B981]',
    danger:
      'bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium shadow-sm focus:ring-[#EF4444]',
    amber:
      'bg-[#F59E0B] hover:bg-[#D97706] text-[#08070D] font-bold shadow-sm focus:ring-[#F59E0B]',
    ghost:
      'bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent focus:ring-white/10'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-xs sm:text-sm px-4.5 py-2.5 gap-2 rounded-xl',
    lg: 'text-sm sm:text-base px-6 py-3 gap-2.5 rounded-2xl font-semibold'
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default Button;
