import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Id', 'Name', 'color', 'icon', 'task_count', 'CreatedOn'],
        orderBy: [
          {
            FieldName: 'Name',
            SortType: 'ASC'
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
      return (response.data || []).map(category => ({
        id: category.Id.toString(),
        name: category.Name || '',
        color: category.color || '#8B5CF6',
        icon: category.icon || 'Folder',
        taskCount: category.task_count || 0
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'color', 'icon', 'task_count', 'CreatedOn']
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      const category = response.data;
      if (!category) return null;
      
      // Map database fields to UI expected format
      return {
        id: category.Id.toString(),
        name: category.Name || '',
        color: category.color || '#8B5CF6',
        icon: category.icon || 'Folder',
        taskCount: category.task_count || 0
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  }

  async create(categoryData) {
    try {
      const params = {
        records: [
          {
            // Only include Updateable fields
            Name: categoryData.name,
            color: categoryData.color || '#8B5CF6',
            icon: categoryData.icon || 'Folder',
            task_count: 0
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
          const category = successfulRecords[0].data;
          toast.success('Category created successfully');
          
          // Map database fields to UI expected format
          return {
            id: category.Id.toString(),
            name: category.Name || '',
            color: category.color || '#8B5CF6',
            icon: category.icon || 'Folder',
            taskCount: category.task_count || 0
          };
        }
      }
      
      throw new Error('Failed to create category');
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Map UI field names to database field names and filter only updateable fields
      const updateData = {};
      
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.taskCount !== undefined) updateData.task_count = updates.taskCount;
      
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
          const category = successfulUpdates[0].data;
          
          // Map database fields to UI expected format
          return {
            id: category.Id.toString(),
            name: category.Name || '',
            color: category.color || '#8B5CF6',
            icon: category.icon || 'Folder',
            taskCount: category.task_count || 0
          };
        }
      }
      
      throw new Error('Failed to update category');
    } catch (error) {
      console.error('Error updating category:', error);
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
          toast.success('Category deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      return false;
    }
  }

  async updateTaskCount(categoryId, count) {
    try {
      return this.update(categoryId, { taskCount: count });
    } catch (error) {
      console.error('Error updating task count:', error);
      return null;
    }
  }
}

export default new CategoryService();