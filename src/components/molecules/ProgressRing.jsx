import React from 'react';
import { motion } from 'framer-motion';

const ProgressRing = ({ 
  progress = 0, 
  size = 100, 
  strokeWidth = 8,
  className = '',
  children,
  ...props 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const filterProps = ({ progress, size, strokeWidth, ...rest }) => rest;
  const ringProps = filterProps(props);

  return (
    <div className={`relative ${className}`} {...ringProps}>
      <svg
        width={size}
        height={size}
        className="progress-ring transform rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="progress-ring-circle"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5B21B6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-surface-500">
              Complete
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;