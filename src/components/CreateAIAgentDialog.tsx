import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { AIAgent } from "@/hooks/useBusiness";

interface CreateAIAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (agentData: any) => void;
}

export function CreateAIAgentDialog({ open, onOpenChange, onSubmit }: CreateAIAgentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'General Operations',
    autonomyLevel: 'semi-autonomous' as 'supervised' | 'semi-autonomous' | 'autonomous',
    model: 'gpt-4',
    apiKey: '',
    specializations: [] as string[],
    externalAPIs: [] as string[],
    outline: '<h2>AI Agent Role</h2>\n<p>Define the specific role and responsibilities of this AI agent.</p>\n<h3>Key Functions:</h3>\n<ul>\n<li>Primary function 1</li>\n<li>Primary function 2</li>\n</ul>'
  });

  const [newSpecialization, setNewSpecialization] = useState('');
  const [newAPI, setNewAPI] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      role: formData.role,
      department: formData.department,
      autonomyLevel: formData.autonomyLevel,
      status: 'offline',
      capabilities: {
        model: formData.model,
        apiKey: formData.apiKey,
        specializations: formData.specializations,
        externalAPIs: formData.externalAPIs
      },
      outline: {
        content: formData.outline,
        version: '1.0',
        lastUpdated: new Date().toISOString()
      },
      metrics: {
        tasksCompleted: 0,
        apiCallsMade: 0,
        dataProcessed: 0,
        uptime: 100,
        responseTime: 150
      }
    });
    
    // Reset form
    setFormData({
      name: '', role: '', department: 'General Operations', 
      autonomyLevel: 'semi-autonomous', model: 'gpt-4', apiKey: '',
      specializations: [], externalAPIs: [],
      outline: '<h2>AI Agent Role</h2>\n<p>Define the specific role and responsibilities of this AI agent.</p>\n<h3>Key Functions:</h3>\n<ul>\n<li>Primary function 1</li>\n<li>Primary function 2</li>\n</ul>'
    });
    onOpenChange(false);
  };

  const addSpecialization = () => {
    if (newSpecialization && !formData.specializations.includes(newSpecialization)) {
      setFormData(prev => ({ ...prev, specializations: [...prev.specializations, newSpecialization] }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({ ...prev, specializations: prev.specializations.filter(s => s !== spec) }));
  };

  const addAPI = () => {
    if (newAPI && !formData.externalAPIs.includes(newAPI)) {
      setFormData(prev => ({ ...prev, externalAPIs: [...prev.externalAPIs, newAPI] }));
      setNewAPI('');
    }
  };

  const removeAPI = (api: string) => {
    setFormData(prev => ({ ...prev, externalAPIs: prev.externalAPIs.filter(a => a !== api) }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Agent Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Data Analysis Agent"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Data Analyst & Report Generator"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Operations">General Operations</SelectItem>
                  <SelectItem value="Data Processing">Data Processing</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Research & Development">Research & Development</SelectItem>
                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  <SelectItem value="Content Creation">Content Creation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Autonomy Level</Label>
              <Select value={formData.autonomyLevel} onValueChange={(value: any) => setFormData(prev => ({ ...prev, autonomyLevel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervised">Supervised</SelectItem>
                  <SelectItem value="semi-autonomous">Semi-Autonomous</SelectItem>
                  <SelectItem value="autonomous">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grok-4">Grok 4</SelectItem>
                    <SelectItem value="grok-2">Grok 2</SelectItem>
                    <SelectItem value="grok-2-mini">Grok 2 Mini</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="claude-4">Claude 4</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>API Key (Optional)</Label>
            <Input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Enter API key for this agent"
            />
          </div>

          <div className="space-y-3">
            <Label>Specializations</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add specialization..."
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
              />
              <Button type="button" onClick={addSpecialization}>Add</Button>
            </div>
            {formData.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.specializations.map(spec => (
                  <Badge key={spec} variant="secondary" className="gap-1">
                    {spec}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeSpecialization(spec)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>External APIs</Label>
            <div className="flex gap-2">
              <Input
                placeholder="API name or URL..."
                value={newAPI}
                onChange={(e) => setNewAPI(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAPI())}
              />
              <Button type="button" onClick={addAPI}>Add</Button>
            </div>
            {formData.externalAPIs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.externalAPIs.map(api => (
                  <Badge key={api} variant="outline" className="gap-1">
                    {api}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeAPI(api)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Agent Outline (HTML)</Label>
            <Textarea
              value={formData.outline}
              onChange={(e) => setFormData(prev => ({ ...prev, outline: e.target.value }))}
              placeholder="Define the agent's role, responsibilities, and guidelines in HTML format..."
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use HTML formatting to define the agent's role, responsibilities, and operational guidelines.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create AI Agent</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}