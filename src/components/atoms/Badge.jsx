import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children,
  variant = 'default',
  size = 'medium',
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-surface-100 text-surface-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  };
  
  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  };

  const iconSizes = {
    small: 12,
    medium: 14,
    large: 16
  };

  const filterProps = ({ variant, size, icon, ...rest }) => rest;
  const badgeProps = filterProps(props);

  return (
    <span 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...badgeProps}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'mr-1' : ''} 
        />
      )}
      {children}
    </span>
  );
};

export default Badge;