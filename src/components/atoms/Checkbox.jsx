import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  size = 'medium',
  ...props 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const iconSizes = {
    small: 12,
    medium: 14,
    large: 16
  };

  const filterProps = ({ label, size, ...rest }) => rest;
  const checkboxProps = filterProps(props);

  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...checkboxProps}
        />
        
        <motion.div
          className={`${sizes[size]} border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
            checked 
              ? 'bg-primary border-primary text-white' 
              : 'border-surface-300 bg-white hover:border-surface-400'
          }`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="Check" size={iconSizes[size]} />
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {label && (
        <span className="ml-2 text-sm font-medium text-surface-700 select-none">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;