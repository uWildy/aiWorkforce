import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';
import { Save, Key, Bot, Database, Shield, Palette, TestTube } from 'lucide-react';
import AITestPanel from './AITestPanel';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { errorToast } from "@/lib/utils"; // Assuming wrapper in utils.ts
interface Settings {
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
  uiTheme: {
    colorScheme: 'obsidian' | 'midnight' | 'arctic' | 'forest' | 'sunset';
    accentColor: string;
    sidebarStyle: 'dark' | 'light' | 'auto';
    compactMode: boolean;
  };
}

export function SettingsDashboard() {
  
  const [settings, setSettings] = useState<Settings>({
    apiKeys: { xai: '', openai: '', anthropic: '', google: '' },
    aiModels: { defaultModel: 'grok-4', temperature: 0.7, maxTokens: 2048 },
    database: { host: 'localhost', username: '', database: 'ai_workforce' },
    security: { enableAuthentication: false, sessionTimeout: 60, rateLimiting: true },
    notifications: { emailNotifications: true, taskUpdates: true, systemAlerts: true },
    uiTheme: { colorScheme: 'obsidian', accentColor: '#8B5CF6', sidebarStyle: 'dark', compactMode: false },
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiService.getSettings();
      if (response.success && response.data) {
        const fetchedSettings = response.data as any;
        setSettings({
          ...settings,
          ...fetchedSettings,
          uiTheme: {
            ...settings.uiTheme,
            ...fetchedSettings.uiTheme
          }
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await apiService.updateSettings(settings);
      if (response.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

const ErrorReport = () => {
  const { data: logs, isLoading, error, refetch } = useQuery({
    queryKey: ['errorLogs'],
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost/ai_workforce/api/errors/index.php');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        if (!jsonData.success) {
          throw new Error(jsonData.error || 'Backend failure');
        }
        if (!Array.isArray(jsonData.data)) {
          console.warn('Non-array data:', jsonData.data);
          throw new Error('Invalid data format from backend');
        }
        return jsonData.data;  // Return the array directly
      } catch (e) {
        console.error('Fetch error:', e);
        throw e;
      }
    },
  });

  // Add this function to clear logs
  const clearLogs = async () => {
    try {
      const response = await fetch('http://localhost/ai_workforce/api/errors/clear.php', { method: 'POST' });
      const json = await response.json();
      if (json.success) {
        toast.success('Error logs cleared');
        refetch();
      } else {
        toast.error(json.error || 'Failed to clear logs');
      }
    } catch (e) {
      toast.error('Network error while clearing logs');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading logs: {error.message}</div>;

  try {
    let logArray = [];
    if (Array.isArray(logs)) {
      logArray = logs;
    } else if (logs && typeof logs === 'object' && logs.error) {
      throw new Error(`Backend error: ${logs.error}`);
    }

    return (
      <div>
        <div className="flex justify-end mb-2">
          <Button variant="destructive" size="sm" onClick={clearLogs}>
            Clear Error Logs
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No errors logged yet.</TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.severity}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  } catch (renderError) {
    console.error('Rendering error:', renderError);
    return <div>Error rendering logs: {renderError.message}</div>;
  }
};
  
  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings Dashboard</h2>
          <p className="text-muted-foreground">Configure your AI workforce management system</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>


        <div className="flex items-center justify-between">
  
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="errors">Error Report</TabsTrigger>
  </TabsList>

  <TabsContent value="general">
      <Tabs defaultValue="api-keys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="ai-models">AI Models</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ui-theme">UI Theme</TabsTrigger>
          <TabsTrigger value="ai-test">AI Test</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Keys Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">API Key Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.apiKeys.xai ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>xAI (Grok): {settings.apiKeys.xai ? 'Configured' : 'Not Set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.apiKeys.openai ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>OpenAI: {settings.apiKeys.openai ? 'Configured' : 'Not Set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.apiKeys.anthropic ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Anthropic: {settings.apiKeys.anthropic ? 'Configured' : 'Not Set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.apiKeys.google ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Google AI: {settings.apiKeys.google ? 'Configured' : 'Not Set'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="xai-key">xAI API Key (Primary - Required for Grok)</Label>
                <Input
                  id="xai-key"
                  type="password"
                  value={settings.apiKeys.xai}
                  onChange={(e) => updateSetting('apiKeys', 'xai', e.target.value)}
                  placeholder="xai-..."
                />
                
                <p className="text-xs text-muted-foreground">
                  Get your API key from <a href="https://console.x.ai/" target="_blank" className="text-primary hover:underline">console.x.ai</a>
                </p>
              </div>
              {/*
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key (Optional)</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={settings.apiKeys.openai}
                  onChange={(e) => updateSetting('apiKeys', 'openai', e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground">
                  For GPT models - Get from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-primary hover:underline">OpenAI Platform</a>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">Anthropic API Key (Optional)</Label>
                <Input
                  id="anthropic-key"
                  type="password"
                  value={settings.apiKeys.anthropic}
                  onChange={(e) => updateSetting('apiKeys', 'anthropic', e.target.value)}
                  placeholder="sk-ant-..."
                />
                <p className="text-xs text-muted-foreground">
                  For Claude models - Get from <a href="https://console.anthropic.com/" target="_blank" className="text-primary hover:underline">Anthropic Console</a>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-key">Google AI API Key (Optional)</Label>
                <Input
                  id="google-key"
                  type="password"
                  value={settings.apiKeys.google}
                  onChange={(e) => updateSetting('apiKeys', 'google', e.target.value)}
                  placeholder="AIza..."
                />
                <p className="text-xs text-muted-foreground">
                  For Gemini models - Get from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a>
                </p>
              </div>
              */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-models">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default AI Model</Label>
                <Select
                  value={settings.aiModels.defaultModel}
                  onValueChange={(value) => updateSetting('aiModels', 'defaultModel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grok-4">Grok 4 (Primary)</SelectItem>
                    <SelectItem value="grok-2">Grok 2</SelectItem>
                    <SelectItem value="grok-2-mini">Grok 2 Mini</SelectItem>
                    <SelectItem value="grok-1.5">Grok 1.5</SelectItem>
                    <SelectItem value="grok-1">Grok 1</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature: {settings.aiModels.temperature}</Label>
                <Input
                  id="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.aiModels.temperature}
                  onChange={(e) => updateSetting('aiModels', 'temperature', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={settings.aiModels.maxTokens}
                  onChange={(e) => updateSetting('aiModels', 'maxTokens', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Database Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="db-host">Database Host</Label>
                <Input
                  id="db-host"
                  value={settings.database.host}
                  onChange={(e) => updateSetting('database', 'host', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-username">Username</Label>
                <Input
                  id="db-username"
                  value={settings.database.username}
                  onChange={(e) => updateSetting('database', 'username', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-name">Database Name</Label>
                <Input
                  id="db-name"
                  value={settings.database.database}
                  onChange={(e) => updateSetting('database', 'database', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require login to access the system</p>
                </div>
                <Switch
                  checked={settings.security.enableAuthentication}
                  onCheckedChange={(checked) => updateSetting('security', 'enableAuthentication', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">Enable API rate limiting</p>
                </div>
                <Switch
                  checked={settings.security.rateLimiting}
                  onCheckedChange={(checked) => updateSetting('security', 'rateLimiting', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Updates</Label>
                  <p className="text-sm text-muted-foreground">Notifications for task changes</p>
                </div>
                <Switch
                  checked={settings.notifications.taskUpdates}
                  onCheckedChange={(checked) => updateSetting('notifications', 'taskUpdates', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical system notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.systemAlerts}
                  onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui-theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                UI Theme & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select
                  value={settings.uiTheme.colorScheme}
                  onValueChange={(value: any) => updateSetting('uiTheme', 'colorScheme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obsidian">Obsidian (Current)</SelectItem>
                    <SelectItem value="midnight">Midnight Blue</SelectItem>
                    <SelectItem value="arctic">Arctic White</SelectItem>
                    <SelectItem value="forest">Forest Green</SelectItem>
                    <SelectItem value="sunset">Sunset Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.uiTheme.accentColor}
                    onChange={(e) => updateSetting('uiTheme', 'accentColor', e.target.value)}
                    className="w-16"
                  />
                  <Input
                    value={settings.uiTheme.accentColor}
                    onChange={(e) => updateSetting('uiTheme', 'accentColor', e.target.value)}
                    placeholder="#8B5CF6"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sidebar Style</Label>
                <Select
                  value={settings.uiTheme.sidebarStyle}
                  onValueChange={(value: any) => updateSetting('uiTheme', 'sidebarStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                </div>
                <Switch
                  checked={settings.uiTheme.compactMode}
                  onCheckedChange={(checked) => updateSetting('uiTheme', 'compactMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-test">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                AI Integration Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
            <AITestPanel /> 
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
  </TabsContent>

  <TabsContent value="errors">
    <Button variant="outline" onClick={() => errorToast('Test Error', { severity: 'low' })}> Test errorToast</Button>

<ErrorReport />
 </TabsContent>
</Tabs>
   </div>



</div>
  );
}

export default SettingsDashboard