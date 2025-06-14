import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(200);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(150);
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      categoryId: taskData.categoryId,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = { ...this.tasks[index], ...updates };
    if (updates.completed && !this.tasks[index].completed) {
      updatedTask.completedAt = new Date().toISOString();
    } else if (!updates.completed && this.tasks[index].completed) {
      updatedTask.completedAt = null;
    }
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(200);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks.splice(index, 1);
    return true;
  }

  async getByCategory(categoryId) {
    await delay(150);
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  }

  async search(query) {
    await delay(100);
    const lowercaseQuery = query.toLowerCase();
    return this.tasks.filter(t => 
      t.title.toLowerCase().includes(lowercaseQuery) ||
      t.description.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }));
  }

  async toggleComplete(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return this.update(id, { completed: !task.completed });
  }

  async updateOrder(taskIds) {
    await delay(200);
    // Reorder tasks based on provided array of IDs
    const reorderedTasks = [];
    taskIds.forEach(id => {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        reorderedTasks.push(task);
      }
    });
    
    // Add any tasks not in the reorder list
    this.tasks.forEach(task => {
      if (!taskIds.includes(task.id)) {
        reorderedTasks.push(task);
      }
    });
    
    this.tasks = reorderedTasks;
    return [...this.tasks];
  }
}

export default new TaskService();