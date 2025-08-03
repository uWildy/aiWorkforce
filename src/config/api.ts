// API Configuration
export const API_BASE_URL = 'http://127.0.0.1/ai_workforce/api';

export const API_ENDPOINTS = {
  // Agents
  agents: `${API_BASE_URL}/agents`,
  createAgent: `${API_BASE_URL}/agents/create.php`,
  updateAgent: `${API_BASE_URL}/agents/update.php`,
  
  // Tasks
  tasks: `${API_BASE_URL}/tasks`,
  createTask: `${API_BASE_URL}/tasks/create.php`,
  updateTask: `${API_BASE_URL}/tasks/update.php`,
  
  // Messages
  messages: `${API_BASE_URL}/messages`,
  sendMessage: `${API_BASE_URL}/messages/send.php`,
  
  // Settings
  settings: `${API_BASE_URL}/settings`,
  updateSettings: `${API_BASE_URL}/settings/update.php`,
  
  // Workgroups
  workgroups: `${API_BASE_URL}/workgroups`,
  createWorkgroup: `${API_BASE_URL}/workgroups/create.php`,
  updateWorkgroup: `${API_BASE_URL}/workgroups/update.php`,
  
  // Files
  files: `${API_BASE_URL}/files`,
  analyzeFile: `${API_BASE_URL}/files/analyze.php`,
  
  // Authentication
  login: `${API_BASE_URL}/auth/login.php`,
  logout: `${API_BASE_URL}/auth/logout.php`,
  verify: `${API_BASE_URL}/auth/verify.php`,
  
  // AI Integration
  aiChat: `${API_BASE_URL}/ai/chat.php`,
  aiTask: `${API_BASE_URL}/ai/task.php`,
  
} as const;

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}