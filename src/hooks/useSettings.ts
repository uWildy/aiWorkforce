import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface Settings {
  apiKeys: {
    xai: string;
    openai: string;
    anthropic: string;
    google: string;
  };
  aiModels: {
    defaultModel: string;
    temperature: number;
    maxTokens: number;
  };
  database: {
    host: string;
    username: string;
    database: string;
  };
  security: {
    enableAuthentication: boolean;
    sessionTimeout: number;
    rateLimiting: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    taskUpdates: boolean;
    systemAlerts: boolean;
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSettings();
      
      if (response.success && response.data) {
        setSettings(response.data as Settings);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch settings');
        toast.error('Failed to load settings');
      }
    } catch (err) {
      setError('Network error');
      toast.error('Network error while loading settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const response = await apiService.updateSettings(newSettings);
      
      if (response.success) {
        await fetchSettings();
        toast.success('Settings updated successfully');
        return true;
      } else {
        toast.error(response.error || 'Failed to update settings');
        return false;
      }
    } catch (err) {
      toast.error('Network error while updating settings');
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  };
}