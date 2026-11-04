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
        whileHover: { y: -3, transition: { duration: 0.2 } },
        whileTap: { scale: 0.99 }
      }
    : {};

  return (
    <Component
      onClick={onClick}
      {...motionProps}
      className={`glass-card-elevated rounded-2xl relative overflow-hidden ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Subtle top reflection line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {(title || subtitle || action) && (
        <div className="px-6 py-4.5 border-b border-white/[0.07] flex items-center justify-between gap-4 bg-white/[0.015]">
          <div>
            {title && (
              <h3 className="font-display font-semibold text-campus-text text-base md:text-lg tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs md:text-sm text-campus-textMuted mt-0.5 font-normal">
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
