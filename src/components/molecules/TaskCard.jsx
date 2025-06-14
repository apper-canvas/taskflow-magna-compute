import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Checkbox from '@/components/atoms/Checkbox';
import confetti from 'canvas-confetti';

const TaskCard = ({ 
  task, 
  category,
  onToggleComplete,
  onEdit,
  onDelete,
  className = '',
  ...props 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, categoryId: task.categoryId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleToggleComplete = async (checked) => {
    if (checked && !task.completed) {
      setIsCompleting(true);
      
      // Trigger confetti animation
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      
      // Delay to show animation
      setTimeout(() => {
        onToggleComplete(task.id);
        setIsCompleting(false);
      }, 500);
    } else {
      onToggleComplete(task.id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Minus';
      case 'low': return 'ArrowDown';
      default: return 'Minus';
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'default';
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'error';
    if (isToday(date)) return 'warning';
    return 'info';
  };

  const filterProps = ({ 
    task, category, onToggleComplete, onEdit, onDelete, ...rest 
  }) => rest;
  const cardProps = filterProps(props);

  return (
    <motion.div
      ref={drag}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 5 : 0
      }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow-sm border border-surface-200 p-4 cursor-move hover:shadow-md transition-all duration-200 ${
        task.completed ? 'opacity-70' : ''
      } ${className}`}
      {...cardProps}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed || isCompleting}
            onChange={handleToggleComplete}
            size="medium"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-medium text-surface-900 break-words ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-error animate-pulse-gentle' : 
                  task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                }`}
                animate={task.priority === 'high' ? { 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                } : {}}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm text-surface-600 mb-3 break-words ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {category && (
                <Badge
                  variant="default"
                  size="small"
                  icon={category.icon}
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${category.color}20`,
                    color: category.color
                  }}
                >
                  {category.name}
                </Badge>
              )}
              
              <Badge
                variant={getPriorityColor(task.priority)}
                size="small"
                icon={getPriorityIcon(task.priority)}
              >
                {task.priority}
              </Badge>
            </div>
            
            {task.dueDate && (
              <Badge
                variant={getDueDateColor(task.dueDate)}
                size="small"
                icon="Calendar"
              >
                {formatDueDate(task.dueDate)}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {isCompleting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-success"
          >
            <ApperIcon name="CheckCircle" size={48} />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskCard;