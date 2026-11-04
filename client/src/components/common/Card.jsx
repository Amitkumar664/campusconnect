import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
  interactive = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-campus-card rounded-2xl border border-campus-border overflow-hidden transition-all duration-200 ${
        interactive ? 'hover:border-campus-borderGlow hover:translate-y-[-2px] cursor-pointer' : ''
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="px-6 py-4.5 border-b border-campus-border flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="font-display font-semibold text-campus-text text-base md:text-lg">{title}</h3>}
            {subtitle && <p className="text-xs md:text-sm text-campus-textMuted mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;

