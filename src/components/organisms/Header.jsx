import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import ProgressRing from '@/components/molecules/ProgressRing';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ 
  onSearch,
  onAddTask,
  completionStats = { completed: 0, total: 0 },
  className = '',
  ...props 
}) => {
  const completionPercentage = completionStats.total > 0 
    ? (completionStats.completed / completionStats.total) * 100 
    : 0;

  const filterProps = ({ 
    onSearch, onAddTask, completionStats, ...rest 
  }) => rest;
  const headerProps = filterProps(props);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-white border-b border-surface-200 px-6 py-4 ${className}`}
      {...headerProps}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <ApperIcon name="CheckSquare" size={32} className="text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-display font-bold text-surface-900">
                TaskFlow
              </h1>
              <p className="text-sm text-surface-600">
                Organize your tasks efficiently
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <ProgressRing 
              progress={completionPercentage}
              size={60}
              strokeWidth={6}
            >
              <div className="text-center">
                <div className="text-xs font-semibold text-surface-900">
                  {completionStats.completed}
                </div>
                <div className="text-xs text-surface-500">
                  of {completionStats.total}
                </div>
              </div>
            </ProgressRing>
            <div className="text-sm">
              <div className="font-medium text-surface-900">
                {completionStats.completed} completed
              </div>
              <div className="text-surface-600">
                {completionStats.total - completionStats.completed} remaining
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search tasks..."
              className="w-80"
            />
          </div>
          
          <Button
            variant="primary"
            icon="Plus"
            onClick={onAddTask}
            className="shadow-lg"
          >
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="sm:hidden mt-4">
        <SearchBar 
          onSearch={onSearch}
          placeholder="Search tasks..."
        />
      </div>
      
      {/* Mobile progress */}
      <div className="md:hidden mt-4 flex items-center justify-center space-x-4">
        <ProgressRing 
          progress={completionPercentage}
          size={80}
          strokeWidth={8}
        />
        <div className="text-sm">
          <div className="font-medium text-surface-900">
            {completionStats.completed} of {completionStats.total} completed
          </div>
          <div className="text-surface-600">
            {Math.round(completionPercentage)}% progress today
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;