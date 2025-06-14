import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import Header from '@/components/organisms/Header';
import CategorySidebar from '@/components/molecules/CategorySidebar';
import TaskList from '@/components/organisms/TaskList';
import AddTaskModal from '@/components/organisms/AddTaskModal';
import ApperIcon from '@/components/ApperIcon';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Update category task counts
  useEffect(() => {
    const updateCategoryCounts = async () => {
      const updatedCategories = categories.map(category => ({
        ...category,
        taskCount: tasks.filter(task => task.categoryId === category.id).length
      }));
      
      setCategories(updatedCategories);
    };
    
    if (categories.length > 0) {
      updateCategoryCounts();
    }
  }, [tasks]);

  // Filter tasks based on selected category and search query
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [tasks, selectedCategory, searchQuery]);

  // Calculate completion stats
  const completionStats = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    return { completed, total };
  }, [tasks]);

  // Handle task creation
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  };

  // Handle task completion toggle
  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      const action = updatedTask.completed ? 'completed' : 'uncompleted';
      toast.success(`Task ${action} successfully`);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  // Handle task drag and drop
  const handleTaskDrop = async (taskId, newCategoryId) => {
    try {
      const updatedTask = await taskService.update(taskId, { 
        categoryId: newCategoryId 
      });
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      toast.success('Task moved successfully');
    } catch (error) {
      toast.error('Failed to move task');
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <ApperIcon name="Loader" size={48} className="text-primary" />
          </motion.div>
          <p className="text-surface-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-800 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header
        onSearch={handleSearch}
        onAddTask={() => setIsAddModalOpen(true)}
        completionStats={completionStats}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-background p-6 overflow-y-auto border-r border-surface-200">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">
                {selectedCategory 
                  ? categories.find(cat => cat.id === selectedCategory)?.name || 'Tasks'
                  : 'All Tasks'
                }
              </h2>
              <p className="text-surface-600">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            
            <TaskList
              tasks={filteredTasks}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onTaskDrop={handleTaskDrop}
              categoryId={selectedCategory}
            />
          </div>
        </main>
      </div>
      
      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
        categories={categories}
      />
    </div>
  );
};

export default TaskManager;