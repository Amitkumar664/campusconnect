import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'blue', // blue | emerald | amber | cyan | rose
  className = ''
}) => {
  const variantStyles = {
    blue: {
      border: 'border-slate-200 hover:border-blue-400',
      iconBg: 'bg-blue-50 text-[#387ED1] border border-blue-100 shadow-sm',
      accentBar: 'bg-[#387ED1]'
    },
    emerald: {
      border: 'border-slate-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm',
      accentBar: 'bg-emerald-500'
    },
    amber: {
      border: 'border-slate-200 hover:border-orange-400',
      iconBg: 'bg-orange-50 text-[#FF5722] border border-orange-100 shadow-sm',
      accentBar: 'bg-[#FF5722]'
    },
    cyan: {
      border: 'border-slate-200 hover:border-sky-400',
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-100 shadow-sm',
      accentBar: 'bg-sky-500'
    },
    rose: {
      border: 'border-slate-200 hover:border-rose-400',
      iconBg: 'bg-rose-50 text-[#DF514C] border border-rose-100 shadow-sm',
      accentBar: 'bg-[#DF514C]'
    }
  };

  const currentStyle = variantStyles[variant] || (variant === 'emerald' ? variantStyles.emerald : variantStyles.blue);

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`bg-white rounded-2xl p-5 sm:p-6 border shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_-5px_rgba(56,126,209,0.08),0_8px_10px_-6px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-200 group ${currentStyle.border} ${className}`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 flex items-baseline gap-1">
            {value}
          </h3>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 pt-1">
              {trend && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    trendPositive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {trendPositive ? '↑' : '↓'} {trend}
                </span>
              )}
              {subtitle && (
                <span className="text-[11px] text-slate-400 font-medium">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${currentStyle.iconBg}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      {/* Bottom accent bar on hover */}
      <div className={`absolute bottom-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentStyle.accentBar}`} />
    </motion.div>
  );
};

export default StatCard;
