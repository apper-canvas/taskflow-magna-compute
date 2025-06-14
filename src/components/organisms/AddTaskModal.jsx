import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const AddTaskModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  categories = [],
  initialData = null,
  className = '',
  ...props 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId || '',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate ? format(new Date(initialData.dueDate), 'yyyy-MM-dd') : ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };
      
      await onSubmit(taskData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        priority: 'medium',
        dueDate: ''
      });
    } catch (error) {
      console.error('Failed to save task:', error);
      // Error notification handled in service
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  const filterProps = ({ 
    isOpen, onClose, onSubmit, categories, initialData, ...rest 
  }) => rest;
  const modalProps = filterProps(props);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            {...modalProps}
          >
            <div className={`bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold text-surface-900">
                    {initialData ? 'Edit Task' : 'Add New Task'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-surface-400 hover:text-surface-600 transition-colors duration-200 p-1 rounded-full hover:bg-surface-100"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Task Title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter task title..."
                    error={errors.title}
                    required
                    disabled={isSubmitting}
                  />
                  
                  <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Add a description (optional)..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                  
                  <Select
                    label="Category"
                    value={formData.categoryId}
                    onChange={(e) => handleChange('categoryId', e.target.value)}
                    options={categoryOptions}
                    placeholder="Select a category"
                    error={errors.categoryId}
                    required
                    disabled={isSubmitting}
                  />
                  
                  <Select
                    label="Priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    options={priorityOptions}
                    disabled={isSubmitting}
                  />
                  
                  <Input
                    label="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    disabled={isSubmitting}
                  />
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSubmitting}
                      icon={initialData ? "Save" : "Plus"}
                    >
                      {initialData ? 'Update Task' : 'Add Task'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;