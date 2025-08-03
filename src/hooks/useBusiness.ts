import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  department: string;
  supervisorId?: string;
  autonomyLevel: 'supervised' | 'semi-autonomous' | 'autonomous';
  status: 'active' | 'idle' | 'busy' | 'offline';
  capabilities: {
    model: string;
    apiKey?: string;
    specializations: string[];
    externalAPIs: string[];
  };
  outline: {
    content: string; // HTML formatted
    version: string;
    lastUpdated: string;
  };
  datasets: {
    id: string;
    name: string;
    format: 'zip' | 'json' | 'csv';
    uploadedAt: string;
    size: number;
  }[];
  directives: {
    id: string;
    content: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    issuedBy: 'user' | 'ai-agent';
    issuedAt: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
  }[];
  metrics: {
    tasksCompleted: number;
    apiCallsMade: number;
    dataProcessed: number; // in MB
    uptime: number; // percentage
    responseTime: number; // in ms
  };
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  budget: number;
  goals: string[];
  employeeCount: number;
  description: string;
  kpis: {
    productivity: number;
    efficiency: number;
    satisfaction: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  ceoId: string;
  departments: string[];
  totalEmployees: number;
  revenue: number;
  founded: string;
  mission: string;
  vision: string;
  values: string[];
  structure: 'flat' | 'hierarchical' | 'matrix';
}

export function useAIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAgents();
      
      if (response.success && response.data) {
        // Transform API agents to AIAgent interface
        const agentData = (response.data as any[]).map((agent: any) => ({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          department: agent.department || 'General Operations',
          supervisorId: agent.supervisorId,
          autonomyLevel: agent.autonomyLevel || 'semi-autonomous',
          status: agent.status || 'offline',
          capabilities: {
            model: agent.model || 'gpt-4',
            apiKey: agent.apiKey || '',
            specializations: agent.specializations || [],
            externalAPIs: agent.externalAPIs || []
          },
          outline: {
            content: agent.outline || '<h2>AI Agent Role</h2><p>This agent is ready to receive instructions.</p>',
            version: '1.0',
            lastUpdated: new Date().toISOString()
          },
          datasets: [],
          directives: [],
          metrics: {
            tasksCompleted: agent.tasksCompleted || 0,
            apiCallsMade: agent.apiCallsMade || 0,
            dataProcessed: agent.dataProcessed || 0,
            uptime: agent.uptime || 95,
            responseTime: agent.responseTime || 150
          },
          createdAt: agent.createdAt || new Date().toISOString()
        }));
        setAgents(agentData);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch AI agents');
        toast.error('Failed to load AI agents');
      }
    } catch (err) {
      setError('Network error');
      toast.error('Network error while loading AI agents');
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: Omit<AIAgent, 'id' | 'createdAt' | 'datasets' | 'directives'>) => {
    try {
      const apiData = {
        name: agentData.name,
        role: agentData.role,
        status: agentData.status,
        model: agentData.capabilities.model,
        apiKey: agentData.capabilities.apiKey,
        department: agentData.department,
        autonomyLevel: agentData.autonomyLevel,
        specializations: agentData.capabilities.specializations,
        outline: agentData.outline.content
      };

      const response = await apiService.createAgent(apiData);
      
      if (response.success) {
        await fetchAgents();
        toast.success('AI Agent created successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to create AI agent');
        return false;
      }
    } catch (err) {
      toast.error('Network error while creating AI agent');
      return false;
    }
  };

  const updateAgent = async (id: string, updates: Partial<AIAgent>) => {
    try {
      const apiUpdates = {
        name: updates.name,
        role: updates.role,
        status: updates.status,
        model: updates.capabilities?.model,
        apiKey: updates.capabilities?.apiKey,
        department: updates.department,
        autonomyLevel: updates.autonomyLevel,
        outline: updates.outline?.content
      };

      const response = await apiService.updateAgent(id, apiUpdates);
      
      if (response.success) {
        await fetchAgents();
        toast.success('AI Agent updated successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to update AI agent');
        return false;
      }
    } catch (err) {
      toast.error('Network error while updating AI agent');
      return false;
    }
  };

  const issueDirective = async (agentId: string, directive: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    try {
      // In a real implementation, this would call a specific API endpoint
      const response = await apiService.sendAIMessage(agentId, directive);
      
      if (response.success) {
        toast.success('Directive issued to AI agent');
        await fetchAgents(); // Refresh to show new directive
        return true;
      } else {
        toast.error('Failed to issue directive');
        return false;
      }
    } catch (err) {
      toast.error('Network error while issuing directive');
      return false;
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
    issueDirective,
  };
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Engineering',
      managerId: 'emp-1',
      budget: 2500000,
      goals: ['Deliver high-quality software', 'Innovate AI solutions', 'Maintain 99.9% uptime'],
      employeeCount: 25,
      description: 'Responsible for all technical development and AI implementation',
      kpis: { productivity: 92, efficiency: 88, satisfaction: 95 }
    },
    {
      id: '2',
      name: 'Marketing',
      managerId: 'emp-2',
      budget: 1500000,
      goals: ['Increase brand awareness', 'Generate quality leads', 'Digital transformation'],
      employeeCount: 12,
      description: 'Drives business growth through strategic marketing initiatives',
      kpis: { productivity: 87, efficiency: 91, satisfaction: 89 }
    },
    {
      id: '3',
      name: 'Sales',
      managerId: 'emp-3',
      budget: 1800000,
      goals: ['Exceed quarterly targets', 'Expand enterprise accounts', 'Customer retention'],
      employeeCount: 18,
      description: 'Focuses on revenue generation and customer acquisition',
      kpis: { productivity: 94, efficiency: 86, satisfaction: 92 }
    }
  ]);

  return { departments };
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'AI Dynamics Corp',
      industry: 'Artificial Intelligence',
      ceoId: 'emp-1',
      departments: ['1', '2', '3'],
      totalEmployees: 55,
      revenue: 12500000,
      founded: '2020',
      mission: 'Democratizing AI for businesses worldwide',
      vision: 'A future where AI empowers every organization',
      values: ['Innovation', 'Transparency', 'Collaboration', 'Excellence'],
      structure: 'hierarchical'
    }
  ]);

  return { organizations };
}