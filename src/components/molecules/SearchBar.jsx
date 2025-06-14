import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search tasks...', 
  className = '',
  debounceMs = 300,
  ...props 
}) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const filterProps = ({ onSearch, debounceMs, ...rest }) => rest;
  const searchProps = filterProps(props);

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ scale: isActive ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        placeholder={placeholder}
        icon="Search"
        iconPosition="left"
        className="pr-10"
        {...searchProps}
      />
      
      {query && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors duration-200 p-1 rounded-full hover:bg-surface-100"
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;