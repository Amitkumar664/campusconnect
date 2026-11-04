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
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-campus-bg disabled:opacity-50 disabled:cursor-not-allowed select-none shine-sweep overflow-hidden cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-campus-bg font-semibold shadow-glow hover:shadow-glow-lg border-t border-white/20 focus:ring-emerald-400',
    amber:
      'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-campus-bg font-semibold shadow-glow-amber hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.5)] border-t border-white/25 focus:ring-amber-400',
    secondary:
      'bg-campus-surface hover:bg-campus-surfaceLight text-campus-text border border-white/10 hover:border-emerald-500/30 shadow-glass focus:ring-emerald-400',
    outline:
      'bg-transparent border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 focus:ring-emerald-400',
    danger:
      'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-medium shadow-sm focus:ring-rose-400',
    ghost:
      'bg-transparent text-campus-textMuted hover:text-campus-text hover:bg-white/[0.06] border border-transparent focus:ring-white/10'
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
