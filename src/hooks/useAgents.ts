import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  tasksCompleted: number;
  currentTask?: string;
  lastActive: string;
  efficiency: number;
  apiKey?: string;
  model?: string;
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAgents();
      
      if (response.success && response.data) {
        setAgents(response.data as Agent[]);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch agents');
        toast.error('Failed to load agents');
      }
    } catch (err) {
      setError('Network error');
      toast.error('Network error while loading agents');
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: Omit<Agent, 'id'>) => {
    try {
      const response = await apiService.createAgent(agentData);
      
      if (response.success) {
        await fetchAgents();
        toast.success('Agent created successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to create agent');
        return false;
      }
    } catch (err) {
      toast.error('Network error while creating agent');
      return false;
    }
  };

  const updateAgent = async (id: string, updates: Partial<Agent>) => {
    try {
      const response = await apiService.updateAgent(id, updates);
      
      if (response.success) {
        await fetchAgents();
        toast.success('Agent updated successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to update agent');
        return false;
      }
    } catch (err) {
      toast.error('Network error while updating agent');
      return false;
    }
  };

  const sendAIMessage = async (agentId: string, message: string) => {
    try {
      const response = await apiService.sendAIMessage(agentId, message);
      
      if (response.success) {
        toast.success('Message sent to AI agent');
        return response.data;
      } else {
        toast.error(response.error || 'Failed to send message');
        return null;
      }
    } catch (err) {
      toast.error('Network error while sending message');
      return null;
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    loading,
    error,
    fetchAgents,
    createAgent,
    updateAgent,
    sendAIMessage,
  };
}