import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Brain, Settings, Save, X } from "lucide-react";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (agentData: any) => void;
}

export function CreateAgentDialog({ open, onOpenChange, onSubmit }: CreateAgentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    model: 'grok-4',
    apiKey: '',
    systemPrompt: '',
    personality: '',
    skills: [] as string[],
    maxTokens: 2048,
    temperature: 0.7,
    status: 'offline'
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tasksCompleted: 0,
      efficiency: 0,
      lastActive: new Date().toISOString()
    });
    setFormData({
      name: '',
      role: '',
      model: 'grok-4',
      apiKey: '',
      systemPrompt: '',
      personality: '',
      skills: [],
      maxTokens: 2048,
      temperature: 0.7,
      status: 'offline'
    });
    onOpenChange(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const modelOptions = [
    { value: 'grok-4', label: 'Grok 4 (xAI) - FLAGSHIP', featured: true },
    { value: 'grok-2', label: 'Grok 2 (xAI)', featured: true },
    { value: 'grok-2-mini', label: 'Grok 2 Mini (xAI)', featured: true },
    { value: 'grok-1.5', label: 'Grok 1.5 (xAI)', featured: true },
    { value: 'grok-1', label: 'Grok 1 (xAI)', featured: true },
    { value: 'grok-beta', label: 'Grok Beta (xAI)', featured: true },
    { value: 'gpt-4', label: 'GPT-4 (OpenAI)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (OpenAI)' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (OpenAI)' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus (Anthropic)' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (Anthropic)' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku (Anthropic)' },
    { value: 'gemini-pro', label: 'Gemini Pro (Google)' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Create New AI Agent
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="gap-2">
                <Settings className="w-4 h-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="training" className="gap-2">
                <Brain className="w-4 h-4" />
                Training
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Bot className="w-4 h-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Marketing Assistant"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role/Specialization *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Content Creator, Data Analyst"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select 
                  value={formData.model} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Leave empty to use default API keys"
                />
                <p className="text-xs text-muted-foreground">
                  If empty, the agent will use the API keys configured in settings
                </p>
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt *</Label>
                <Textarea
                  id="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="Define the agent's role, behavior, and capabilities..."
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This defines how your agent will behave and respond to tasks
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">Personality & Communication Style</Label>
                <Textarea
                  id="personality"
                  value={formData.personality}
                  onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                  placeholder="Describe the agent's personality, tone, and communication style..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Skills & Capabilities</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness. Lower = more focused, Higher = more creative
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="100"
                    max="4096"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum response length
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Agent Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span className="font-medium">{formData.name || 'Unnamed Agent'}</span>
                    <Badge variant="outline">{formData.role || 'No role'}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Model: {modelOptions.find(m => m.value === formData.model)?.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Skills: {formData.skills.length > 0 ? formData.skills.join(', ') : 'None specified'}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              Create Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}