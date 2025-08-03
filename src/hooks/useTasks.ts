import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  assignedTo: string[];
  progress: number;
  dueDate: string;
  estimatedTime: string;
  createdAt: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTasks();
      
      if (response.success && response.data) {
        setTasks(response.data as Task[]);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch tasks');
        toast.error('Failed to load tasks');
      }
    } catch (err) {
      setError('Network error');
      toast.error('Network error while loading tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const response = await apiService.createTask(taskData);
      
      if (response.success) {
        await fetchTasks();
        toast.success('Task created successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to create task');
        return false;
      }
    } catch (err) {
      toast.error('Network error while creating task');
      return false;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await apiService.updateTask(id, updates);
      
      if (response.success) {
        await fetchTasks();
        toast.success('Task updated successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to update task');
        return false;
      }
    } catch (err) {
      toast.error('Network error while updating task');
      return false;
    }
  };

  const assignTaskToAI = async (taskId: string, agentId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;

      const response = await apiService.assignAITask(agentId, task);
      
      if (response.success) {
        await fetchTasks();
        toast.success('Task assigned to AI agent');
        return true;
      } else {
        toast.error(response.error || 'Failed to assign task');
        return false;
      }
    } catch (err) {
      toast.error('Network error while assigning task');
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    assignTaskToAI,
  };
}