import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface Workgroup {
  id: string;
  name: string;
  description: string;
  goal: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  agent_ids: string[];
  task_ids: string[];
  progress: number;
  created_by: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  agent_count?: number;
  task_count?: number;
}

export function useWorkgroups() {
  const [workgroups, setWorkgroups] = useState<Workgroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkgroups = async () => {
    try {
      setLoading(true);
      const response = await apiService.getWorkgroups();
      
      if (response.success && response.data) {
        setWorkgroups(response.data as Workgroup[]);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch workgroups');
        toast.error('Failed to load workgroups');
      }
    } catch (err) {
      setError('Network error');
      toast.error('Network error while loading workgroups');
    } finally {
      setLoading(false);
    }
  };

  const createWorkgroup = async (workgroupData: Omit<Workgroup, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await apiService.createWorkgroup(workgroupData);
      
      if (response.success) {
        await fetchWorkgroups();
        toast.success('Workgroup created successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to create workgroup');
        return false;
      }
    } catch (err) {
      toast.error('Network error while creating workgroup');
      return false;
    }
  };

  const updateWorkgroup = async (id: string, updates: Partial<Workgroup>) => {
    try {
      const response = await apiService.updateWorkgroup(id, updates);
      
      if (response.success) {
        await fetchWorkgroups();
        toast.success('Workgroup updated successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to update workgroup');
        return false;
      }
    } catch (err) {
      toast.error('Network error while updating workgroup');
      return false;
    }
  };

  useEffect(() => {
    fetchWorkgroups();
  }, []);

  return {
    workgroups,
    loading,
    error,
    fetchWorkgroups,
    createWorkgroup,
    updateWorkgroup,
  };
}