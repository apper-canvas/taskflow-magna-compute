import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrop } from 'react-dnd';
import TaskCard from '@/components/molecules/TaskCard';
import ApperIcon from '@/components/ApperIcon';

const TaskList = ({ 
  tasks = [],
  categories = [],
  onToggleComplete,
  onEdit,
  onDelete,
  onTaskDrop,
  categoryId = null,
  className = '',
  ...props 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => {
      if (item.categoryId !== categoryId) {
        onTaskDrop(item.id, categoryId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.canDrop() && !!monitor.isOver(),
    }),
  }));

  const getCategoryById = (id) => categories.find(cat => cat.id === id);

  const filterProps = ({ 
    tasks, categories, onToggleComplete, onEdit, onDelete, onTaskDrop, categoryId, ...rest 
  }) => rest;
  const listProps = filterProps(props);

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-4"
        >
          <ApperIcon name="CheckSquare" size={64} className="text-surface-300" />
        </motion.div>
        <h3 className="text-lg font-semibold text-surface-900 mb-2">
          No tasks yet
        </h3>
        <p className="text-surface-600 mb-4">
          Create your first task to get started with TaskFlow
        </p>
      </motion.div>
    );
  }

  return (
    <div
      ref={drop}
      className={`space-y-4 ${isOver ? 'bg-secondary/5 rounded-lg p-4' : ''} ${className}`}
      {...listProps}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.1
            }}
          >
            <TaskCard
              task={task}
              category={getCategoryById(task.categoryId)}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-dashed border-secondary rounded-lg p-8 text-center text-secondary"
        >
          <ApperIcon name="Plus" size={24} className="mx-auto mb-2" />
          <p className="font-medium">Drop task here</p>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;