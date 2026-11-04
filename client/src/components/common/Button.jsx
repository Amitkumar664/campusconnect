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
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none shine-sweep overflow-hidden cursor-pointer';

  const variants = {
    primary:
      'bg-[#387ED1] hover:bg-[#2B6EB8] text-white font-semibold shadow-[0_2px_6px_rgba(56,126,209,0.25)] hover:shadow-[0_4px_12px_rgba(56,126,209,0.35)] focus:ring-[#387ED1]',
    amber:
      'bg-[#FF5722] hover:bg-[#EA4A16] text-white font-semibold shadow-[0_2px_6px_rgba(255,87,34,0.25)] hover:shadow-[0_4px_12px_rgba(255,87,34,0.35)] focus:ring-[#FF5722]',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm hover:border-slate-300 focus:ring-[#387ED1]',
    outline:
      'bg-transparent border border-[#387ED1] text-[#387ED1] hover:bg-blue-50/60 focus:ring-[#387ED1]',
    danger:
      'bg-[#DF514C] hover:bg-[#CF403B] text-white font-medium shadow-sm focus:ring-[#DF514C]',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent focus:ring-slate-300'
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
