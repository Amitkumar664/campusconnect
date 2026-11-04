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
    'w-full bg-campus-surface border rounded-xl text-campus-text placeholder-campus-textSubtle focus:outline-none transition-all duration-200 text-sm';
  const borderClasses = error
    ? 'border-campus-danger focus:ring-1 focus:ring-campus-danger'
    : 'border-campus-border focus:border-campus-primary focus:ring-1 focus:ring-campus-primary/30';
  const paddingClasses = Icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-medium text-campus-textMuted uppercase tracking-wider">
          {label} {required && <span className="text-campus-danger">*</span>}
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
              <option key={opt.value} value={opt.value} className="bg-campus-surface text-campus-text">
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
        <p className="text-xs text-campus-danger mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-campus-textSubtle mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;

