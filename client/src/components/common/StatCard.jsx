import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'emerald', // emerald | amber | cyan | rose
  className = ''
}) => {
  const variantStyles = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)]',
      glow: 'from-emerald-500/10 via-transparent to-transparent',
      accentBar: 'bg-gradient-to-r from-emerald-500 to-teal-400'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_-3px_rgba(245,158,11,0.25)]',
      glow: 'from-amber-500/10 via-transparent to-transparent',
      accentBar: 'bg-gradient-to-r from-amber-500 to-amber-300'
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(56,189,248,0.25)]',
      glow: 'from-cyan-500/10 via-transparent to-transparent',
      accentBar: 'bg-gradient-to-r from-cyan-500 to-sky-400'
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_-3px_rgba(244,63,94,0.25)]',
      glow: 'from-rose-500/10 via-transparent to-transparent',
      accentBar: 'bg-gradient-to-r from-rose-500 to-red-400'
    }
  };

  const currentStyle = variantStyles[variant] || variantStyles.emerald;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass-card-elevated rounded-2xl p-5 sm:p-6 border relative overflow-hidden group ${currentStyle.border} ${className}`}
    >
      {/* Corner ambient radial glow */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${currentStyle.glow} blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      {/* Top 1px inner bevel light line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-campus-textMuted uppercase tracking-wider">
            {title}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5 flex items-baseline gap-1">
            {value}
          </h3>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 pt-1">
              {trend && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    trendPositive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {trendPositive ? '↑' : '↓'} {trend}
                </span>
              )}
              {subtitle && (
                <span className="text-[11px] text-campus-textSubtle font-medium">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 duration-200 ${currentStyle.iconBg}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      {/* Bottom subtle accent bar on hover */}
      <div className={`absolute bottom-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentStyle.accentBar}`} />
    </motion.div>
  );
};

export default StatCard;
