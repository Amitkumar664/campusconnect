import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  options = [], // for select type
  rows = 4, // for textarea
  className = '',
  icon: Icon
}) => {
  const baseInputClasses =
    'w-full bg-white/[0.03] hover:bg-white/[0.045] border rounded-xl text-white placeholder-campus-textSubtle focus:outline-none transition-all duration-200 text-xs sm:text-sm font-medium shadow-glass';
  const borderClasses = error
    ? 'border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
    : 'border-white/[0.08] focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/[0.05]';
  const paddingClasses = Icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-[11px] font-semibold text-campus-textMuted uppercase tracking-wider">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-campus-textSubtle">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`${baseInputClasses} ${borderClasses} ${paddingClasses} resize-none`}
          />
        ) : type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${baseInputClasses} ${borderClasses} ${paddingClasses} appearance-none cursor-pointer`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0D1513] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`${baseInputClasses} ${borderClasses} ${paddingClasses}`}
          />
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-campus-textSubtle mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
