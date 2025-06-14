import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const CategorySidebar = ({ 
  categories = [],
  selectedCategory,
  onCategorySelect,
  className = '',
  ...props 
}) => {
  const filterProps = ({ 
    categories, selectedCategory, onCategorySelect, ...rest 
  }) => rest;
  const sidebarProps = filterProps(props);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`bg-white rounded-lg shadow-sm border border-surface-200 p-4 ${className}`}
      {...sidebarProps}
    >
      <h2 className="font-display font-semibold text-lg text-surface-900 mb-4">
        Categories
      </h2>
      
      <div className="space-y-2">
        {/* All Tasks */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategorySelect(null)}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            selectedCategory === null 
              ? 'bg-primary text-white' 
              : 'text-surface-700 hover:bg-surface-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <ApperIcon name="List" size={18} />
            <span className="font-medium">All Tasks</span>
          </div>
          <Badge
            variant={selectedCategory === null ? 'default' : 'primary'}
            size="small"
            className={selectedCategory === null ? 'bg-white/20 text-white' : ''}
          >
            {categories.reduce((sum, cat) => sum + cat.taskCount, 0)}
          </Badge>
        </motion.button>
        
        {/* Individual Categories */}
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategorySelect(category.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              selectedCategory === category.id 
                ? 'text-white' 
                : 'text-surface-700 hover:bg-surface-50'
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? category.color : 'transparent'
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <ApperIcon name={category.icon} size={18} />
              <span className="font-medium break-words">{category.name}</span>
            </div>
            <Badge
              variant="default"
              size="small"
              className={
                selectedCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : ''
              }
            >
              {category.taskCount}
            </Badge>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default CategorySidebar;