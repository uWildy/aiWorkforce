import { API_ENDPOINTS, APIResponse } from '@/config/api';
import { errorToast } from "@/lib/utils"; // Assuming wrapper in utils.ts
import { useQuery } from '@tanstack/react-query';

class ApiService {

private async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const text = await response.text();
    console.log('Response body:', text); // Debug
    
    if (!text.trim()) throw new Error('Empty response');
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Parse failed on body:', text);
      throw new Error('Invalid JSON response');
    }
  } catch (e) {
    errorToast('API request failed', { stack: e.stack });
    throw e;
  }
}

  // Agents API
  async getAgents() {
    return this.request(`${API_ENDPOINTS.agents}/index.php`);
  }

  async createAgent(agent: any) {
    return this.request(API_ENDPOINTS.createAgent, {
      method: 'POST',
      body: JSON.stringify(agent),
    });
  }

  async updateAgent(id: string, updates: any) {
    return this.request(API_ENDPOINTS.updateAgent, {
      method: 'POST',
      body: JSON.stringify({ id, ...updates }),
    });
  }

  async deleteAgent(id: string) {
    return this.request(`${API_ENDPOINTS.agents}/delete.php`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }

  // Tasks API
  async getTasks() {
    return this.request(`${API_ENDPOINTS.tasks}/index.php`);
  }

  async createTask(task: any) {
    return this.request(API_ENDPOINTS.createTask, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, updates: any) {
    return this.request(`${API_ENDPOINTS.tasks}/update.php`, {
      method: 'POST',
      body: JSON.stringify({ id, ...updates }),
    });
  }

  async deleteTask(id: string) {
    return this.request(`${API_ENDPOINTS.tasks}/delete.php`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }

  // Messages API
  async getMessages(agentId?: string) {
    const url = agentId 
      ? `${API_ENDPOINTS.messages}/index.php?agent=${agentId}`
      : `${API_ENDPOINTS.messages}/index.php`;
    return this.request(url);
  }

  async sendMessage(messageData: any) {
    const payload = {
      content: messageData.content,
      channel: messageData.agentId ? `agent_${messageData.agentId}` : 'general',
      sender_id: messageData.agentId || null,
      message_type: messageData.type || 'text',
      metadata: messageData.metadata
    };
    
    return this.request(API_ENDPOINTS.sendMessage, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Settings API
  async getSettings() {
    return this.request(`${API_ENDPOINTS.settings}/index.php`);
  }

  async updateSettings(settings: any) {
    return this.request(API_ENDPOINTS.updateSettings, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Workgroups API
  async getWorkgroups() {
    return this.request(`${API_ENDPOINTS.workgroups}/index.php`);
  }

  async createWorkgroup(workgroup: any) {
    return this.request(API_ENDPOINTS.createWorkgroup, {
      method: 'POST',
      body: JSON.stringify(workgroup),
    });
  }

  async updateWorkgroup(id: string, updates: any) {
    return this.request(API_ENDPOINTS.updateWorkgroup, {
      method: 'POST',
      body: JSON.stringify({ id, ...updates }),
    });
  }

  async deleteWorkgroup(id: string) {
    return this.request(`${API_ENDPOINTS.workgroups}/delete.php`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }

  // Files API
  async getAgentFiles(agentId: string) {
    return this.request(`${API_ENDPOINTS.files}/index.php?agent_id=${agentId}`);
  }

  async uploadFile(file: File, agentId?: string, description?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (agentId) formData.append('agent_id', agentId);
    if (description) formData.append('description', description);

    try {
      const response = await fetch(`${API_ENDPOINTS.files}/upload.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async uploadFileMetadata(fileData: any) {
    return this.request(`${API_ENDPOINTS.files}/index.php`, {
      method: 'POST',
      body: JSON.stringify(fileData),
    });
  }

  async deleteFile(fileId: string) {
    return this.request(`${API_ENDPOINTS.files}/index.php?file_id=${fileId}`, {
      method: 'DELETE',
    });
  }

  async updateFileAnalysis(fileId: string, analysisResult: any) {
    return this.request(API_ENDPOINTS.analyzeFile, {
      method: 'POST',
      body: JSON.stringify({ file_id: fileId, analysis_result: analysisResult }),
    });
  }

  // AI Integration
  async sendAIMessage(agentId: string, message: string, context?: any) {
    return this.request(API_ENDPOINTS.aiChat, {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        message,
        context,
      }),
    });
  } 



  async assignAITask(agentId: string, task: any) {
    return this.request(API_ENDPOINTS.aiTask, {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        task,
      }),
    });
  }
}

export const apiService = new ApiService();