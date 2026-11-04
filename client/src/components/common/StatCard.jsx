import React from 'react';

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
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'hover:shadow-glow'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'hover:shadow-glow-amber'
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      glow: 'hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.25)]'
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      glow: 'hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.25)]'
    }
  };

  const currentStyle = variantStyles[variant] || variantStyles.emerald;

  return (
    <div
      className={`bg-campus-card rounded-2xl p-6 border transition-all duration-300 ${currentStyle.border} ${currentStyle.glow} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-campus-textMuted uppercase tracking-wider">
            {title}
          </p>
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-campus-text mt-2">
            {value}
          </h3>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 mt-2">
              {trend && (
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                    trendPositive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {trendPositive ? '↑' : '↓'} {trend}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-campus-textSubtle">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl flex-shrink-0 ${currentStyle.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

