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
      className={`glass-card-elevated rounded-3xl relative overflow-hidden transition-all duration-200 ${
        interactive
          ? 'cursor-pointer hover:border-violet-500/40 hover:shadow-[0_20px_45px_-10px_rgba(124,58,237,0.2)]'
          : ''
      } ${className}`}
    >
      {/* Subtle top reflection line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {(title || subtitle || action) && (
        <div className="px-6 py-4.5 border-b border-white/[0.07] flex items-center justify-between gap-4 bg-white/[0.015]">
          <div>
            {title && (
              <h3 className="font-display font-bold text-white text-base md:text-lg tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs md:text-sm text-slate-400 mt-0.5 font-normal">
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
