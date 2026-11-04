import React from 'react';
import { motion } from 'framer-motion';

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
  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive
    ? {
        whileHover: { y: -2, transition: { duration: 0.2 } },
        whileTap: { scale: 0.99 }
      }
    : {};

  return (
    <Component
      onClick={onClick}
      {...motionProps}
      className={`bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-200 ${
        interactive
          ? 'cursor-pointer hover:border-blue-400/60 hover:shadow-[0_10px_25px_-5px_rgba(56,126,209,0.08),0_8px_10px_-6px_rgba(0,0,0,0.03)]'
          : ''
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/40">
          <div>
            {title && (
              <h3 className="font-display font-semibold text-slate-900 text-base md:text-lg tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs md:text-sm text-slate-500 mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </Component>
  );
};

export default Card;
