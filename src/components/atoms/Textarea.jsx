import React, { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Textarea = forwardRef(({ 
  label,
  error,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  rows = 3,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 text-base border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical';
  
  const stateClasses = error 
    ? 'border-error focus:border-error focus:ring-error' 
    : 'border-surface-300 focus:border-primary focus:ring-primary hover:border-surface-400';

  const filterProps = ({ 
    label, error, containerClassName, ...rest 
  }) => rest;
  const textareaProps = filterProps(props);

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        className={`${baseClasses} ${stateClasses} ${className}`}
        {...textareaProps}
      />
      
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;