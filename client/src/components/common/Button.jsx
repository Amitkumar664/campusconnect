import React from 'react';

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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-campus-bg disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-campus-primary hover:bg-campus-primaryHover text-campus-bg font-semibold shadow-glow focus:ring-campus-primary',
    amber:
      'bg-campus-amber hover:bg-campus-amberHover text-campus-bg font-semibold shadow-glow-amber focus:ring-campus-amber',
    secondary:
      'bg-campus-card hover:bg-campus-cardHover text-campus-text border border-campus-border hover:border-campus-borderGlow focus:ring-campus-mint',
    outline:
      'bg-transparent border border-campus-primary text-campus-primary hover:bg-campus-primary/10 focus:ring-campus-primary',
    danger:
      'bg-campus-danger/90 hover:bg-campus-danger text-white shadow-sm focus:ring-campus-danger',
    ghost:
      'bg-transparent text-campus-textMuted hover:text-campus-text hover:bg-white/5 focus:ring-campus-border'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
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
      {children}
    </button>
  );
};

export default Button;

