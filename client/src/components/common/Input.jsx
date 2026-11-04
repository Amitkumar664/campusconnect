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
    'w-full bg-white hover:bg-slate-50/50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm';
  const borderClasses = error
    ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
    : 'border-slate-200 focus:border-[#387ED1] focus:ring-2 focus:ring-[#387ED1]/20 focus:bg-white';
  const paddingClasses = Icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
              <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
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
        <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
