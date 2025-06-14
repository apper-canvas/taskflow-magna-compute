import React, { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 text-base border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white pr-12';
  
  const stateClasses = error 
    ? 'border-error focus:border-error focus:ring-error' 
    : 'border-surface-300 focus:border-primary focus:ring-primary hover:border-surface-400';

  const filterProps = ({ 
    label, error, options, placeholder, containerClassName, ...rest 
  }) => rest;
  const selectProps = filterProps(props);

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClasses} ${stateClasses} ${className}`}
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-surface-400 pointer-events-none">
          <ApperIcon name="ChevronDown" size={18} />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;