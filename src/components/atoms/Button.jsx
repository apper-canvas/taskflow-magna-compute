import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-purple-800 focus:ring-primary shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-white hover:bg-purple-600 focus:ring-secondary shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-surface-600 hover:bg-surface-100 focus:ring-surface-500',
    accent: 'bg-accent text-white hover:bg-amber-600 focus:ring-accent shadow-sm hover:shadow-md',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-sm hover:shadow-md'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const iconSizes = {
    small: 16,
    medium: 18,
    large: 20
  };

  const filterProps = ({ variant, size, icon, iconPosition, loading, ...rest }) => rest;
  const buttonProps = filterProps(props);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...buttonProps}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'mr-2' : ''} 
        />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'ml-2' : ''} 
        />
      )}
    </motion.button>
  );
};

export default Button;