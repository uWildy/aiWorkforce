import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface Message {
  id: string;
  agentId: string;
  content: string;
  type: 'user' | 'agent' | 'system';
  timestamp: string;
  metadata?: {
    taskId?: string;
    workgroupId?: string;
    attachments?: string[];
  };
}

export function useMessages(agentId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMessages(agentId);
      
      if (response.success && response.data) {
        setMessages(response.data as Message[]);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch messages');
        toast.error('Failed to load messages');
      }
    } catch (err) {
      setError('Network error');
      toast.error('Network error while loading messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, type: 'user' | 'agent' = 'user', metadata?: any) => {
    try {
      const messageData = {
        agentId: agentId || '',
        content,
        type,
        metadata
      };

      const response = await apiService.sendMessage(messageData);
      
      if (response.success) {
        await fetchMessages();
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

  const sendAIMessage = async (content: string, context?: any) => {
    if (!agentId) {
      toast.error('No agent selected');
      return null;
    }

    try {
      const response = await apiService.sendAIMessage(agentId, content, context);
      
      if (response.success) {
        await fetchMessages();
        return response.data;
      } else {
        toast.error(response.error || 'Failed to send AI message');
        return null;
      }
    } catch (err) {
      toast.error('Network error while sending AI message');
      return null;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [agentId]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    sendAIMessage,
  };
}