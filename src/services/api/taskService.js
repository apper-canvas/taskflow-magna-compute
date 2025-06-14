import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'CreatedOn'],
        orderBy: [
          {
            FieldName: 'CreatedOn',
            SortType: 'DESC'
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      return (response.data || []).map(task => ({
        id: task.Id.toString(),
        title: task.title || '',
        description: task.description || '',
        categoryId: task.category_id,
        priority: task.priority || 'medium',
        dueDate: task.due_date,
        completed: task.completed || false,
        createdAt: task.CreatedOn,
        completedAt: task.completed_at
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'CreatedOn']
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      const task = response.data;
      if (!task) return null;
      
      // Map database fields to UI expected format
      return {
        id: task.Id.toString(),
        title: task.title || '',
        description: task.description || '',
        categoryId: task.category_id,
        priority: task.priority || 'medium',
        dueDate: task.due_date,
        completed: task.completed || false,
        createdAt: task.CreatedOn,
        completedAt: task.completed_at
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            // Only include Updateable fields
            title: taskData.title,
            description: taskData.description || '',
            category_id: parseInt(taskData.categoryId),
            priority: taskData.priority || 'medium',
            due_date: taskData.dueDate || null,
            completed: false
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          toast.success('Task created successfully');
          
          // Map database fields to UI expected format
          return {
            id: task.Id.toString(),
            title: task.title || '',
            description: task.description || '',
            categoryId: task.category_id,
            priority: task.priority || 'medium',
            dueDate: task.due_date,
            completed: task.completed || false,
            createdAt: task.CreatedOn,
            completedAt: task.completed_at
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Map UI field names to database field names and filter only updateable fields
      const updateData = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.categoryId !== undefined) updateData.category_id = parseInt(updates.categoryId);
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.completed !== undefined) {
        updateData.completed = updates.completed;
        if (updates.completed) {
          updateData.completed_at = new Date().toISOString();
        } else {
          updateData.completed_at = null;
        }
      }
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          
          // Map database fields to UI expected format
          return {
            id: task.Id.toString(),
            title: task.title || '',
            description: task.description || '',
            categoryId: task.category_id,
            priority: task.priority || 'medium',
            dueDate: task.due_date,
            completed: task.completed || false,
            createdAt: task.CreatedOn,
            completedAt: task.completed_at
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Task deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  }

  async getByCategory(categoryId) {
    try {
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'CreatedOn'],
        where: [
          {
            FieldName: 'category_id',
            Operator: 'EqualTo',
            Values: [categoryId]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      return (response.data || []).map(task => ({
        id: task.Id.toString(),
        title: task.title || '',
        description: task.description || '',
        categoryId: task.category_id,
        priority: task.priority || 'medium',
        dueDate: task.due_date,
        completed: task.completed || false,
        createdAt: task.CreatedOn,
        completedAt: task.completed_at
      }));
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
      return [];
    }
  }

  async search(query) {
    try {
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 'completed_at', 'CreatedOn'],
        whereGroups: [
          {
            operator: 'OR',
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: 'title',
                    Operator: 'Contains',
                    Values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: 'description',
                    Operator: 'Contains',
                    Values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      return (response.data || []).map(task => ({
        id: task.Id.toString(),
        title: task.title || '',
        description: task.description || '',
        categoryId: task.category_id,
        priority: task.priority || 'medium',
        dueDate: task.due_date,
        completed: task.completed || false,
        createdAt: task.CreatedOn,
        completedAt: task.completed_at
      }));
    } catch (error) {
      console.error('Error searching tasks:', error);
      return [];
    }
  }

  async toggleComplete(id) {
    try {
      // First get the current task
      const task = await this.getById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      
      // Toggle completion status
      return this.update(id, { completed: !task.completed });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  async updateOrder(taskIds) {
    // Note: This functionality would require a custom field for ordering
    // For now, return the current task list
    try {
      return await this.getAll();
    } catch (error) {
      console.error('Error updating task order:', error);
      return [];
    }
  }
}

export default new TaskService();