import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, Send } from "lucide-react";
import { AIAgent } from "@/hooks/useBusiness";

interface AgentManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AIAgent | null;
  onUpdate: (id: string, updates: Partial<AIAgent>) => void;
  onIssueDirective: (agentId: string, directive: string, priority: 'low' | 'medium' | 'high' | 'critical') => void;
}

export function AgentManagementDialog({ 
  open, 
  onOpenChange, 
  agent, 
  onUpdate, 
  onIssueDirective 
}: AgentManagementDialogProps) {
  const [formData, setFormData] = useState(agent || {} as AIAgent);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newAPI, setNewAPI] = useState('');
  const [directive, setDirective] = useState('');
  const [directivePriority, setDirectivePriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  if (!agent) return null;

  const handleUpdate = () => {
    onUpdate(agent.id, formData);
    onOpenChange(false);
  };

  const handleDirective = () => {
    if (directive.trim()) {
      onIssueDirective(agent.id, directive, directivePriority);
      setDirective('');
    }
  };

  const addSpecialization = () => {
    if (newSpecialization && !formData.capabilities.specializations.includes(newSpecialization)) {
      setFormData(prev => ({
        ...prev,
        capabilities: {
          ...prev.capabilities,
          specializations: [...prev.capabilities.specializations, newSpecialization]
        }
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        specializations: prev.capabilities.specializations.filter(s => s !== spec)
      }
    }));
  };

  const addAPI = () => {
    if (newAPI && !formData.capabilities.externalAPIs.includes(newAPI)) {
      setFormData(prev => ({
        ...prev,
        capabilities: {
          ...prev.capabilities,
          externalAPIs: [...prev.capabilities.externalAPIs, newAPI]
        }
      }));
      setNewAPI('');
    }
  };

  const removeAPI = (api: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        externalAPIs: prev.capabilities.externalAPIs.filter(a => a !== api)
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage AI Agent: {agent.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="directives">Directives</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Uptime:</span>
                      <span className="font-medium">{agent.metrics.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tasks:</span>
                      <span className="font-medium">{agent.metrics.tasksCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">API Calls:</span>
                      <span className="font-medium">{agent.metrics.apiCallsMade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time:</span>
                      <span className="font-medium">{agent.metrics.responseTime}ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Model:</span>
                      <div className="text-sm text-muted-foreground">{agent.capabilities.model}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Specializations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.capabilities.specializations.slice(0, 3).map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active Directives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {agent.directives.filter(d => d.status === 'active').slice(0, 3).map((directive) => (
                      <div key={directive.id} className="text-xs p-2 bg-muted rounded">
                        <div className="font-medium">{directive.priority}</div>
                        <div className="text-muted-foreground truncate">{directive.content}</div>
                      </div>
                    ))}
                    {agent.directives.filter(d => d.status === 'active').length === 0 && (
                      <div className="text-xs text-muted-foreground">No active directives</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agent Name</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={formData.role || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select 
                  value={formData.department || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
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
                <Select 
                  value={formData.autonomyLevel || ''} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, autonomyLevel: value }))}
                >
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
                <Select 
                  value={formData.capabilities?.model || ''} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    capabilities: { ...prev.capabilities, model: value }
                  }))}
                >
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
              <Label>API Key</Label>
              <Input
                type="password"
                value={formData.capabilities?.apiKey || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  capabilities: { ...prev.capabilities, apiKey: e.target.value }
                }))}
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
              {formData.capabilities?.specializations?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.capabilities.specializations.map(spec => (
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
              {formData.capabilities?.externalAPIs?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.capabilities.externalAPIs.map(api => (
                    <Badge key={api} variant="outline" className="gap-1">
                      {api}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeAPI(api)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleUpdate}>Update Configuration</Button>
            </div>
          </TabsContent>

          <TabsContent value="outline" className="space-y-4">
            <div className="space-y-2">
              <Label>Agent Outline (HTML)</Label>
              <Textarea
                value={formData.outline?.content || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  outline: { ...prev.outline, content: e.target.value }
                }))}
                placeholder="Define the agent's role, responsibilities, and guidelines in HTML format..."
                className="min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use HTML formatting to define the agent's role, responsibilities, and operational guidelines.
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpdate}>Update Outline</Button>
            </div>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Loaded Datasets</h3>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Dataset
                </Button>
              </div>
              
              {agent.datasets.length > 0 ? (
                <div className="space-y-2">
                  {agent.datasets.map((dataset) => (
                    <Card key={dataset.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{dataset.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {dataset.format.toUpperCase()} • {(dataset.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(dataset.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No datasets loaded</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload datasets to enhance this agent's capabilities
                    </p>
                    <Button variant="outline">Upload First Dataset</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="directives" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Issue New Directive</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Directive</Label>
                    <Textarea
                      value={directive}
                      onChange={(e) => setDirective(e.target.value)}
                      placeholder="Enter directive for the AI agent..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={directivePriority} onValueChange={(value: any) => setDirectivePriority(value)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleDirective} className="gap-2 mt-6">
                      <Send className="w-4 h-4" />
                      Issue Directive
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h3 className="font-medium">Directive History</h3>
                {agent.directives.length > 0 ? (
                  <div className="space-y-2">
                    {agent.directives.map((directive) => (
                      <Card key={directive.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={directive.priority === 'critical' ? 'destructive' : 'secondary'}>
                                  {directive.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {directive.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  by {directive.issuedBy}
                                </span>
                              </div>
                              <p className="text-sm">{directive.content}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(directive.issuedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Send className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">No directives issued</h3>
                      <p className="text-muted-foreground">
                        Issue directives to guide this agent's behavior
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}