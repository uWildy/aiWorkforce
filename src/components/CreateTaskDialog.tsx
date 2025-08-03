import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Save, X, Calendar, Clock, User } from "lucide-react";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: any) => void;
  agents: any[];
}

export function CreateTaskDialog({ open, onOpenChange, onSubmit, agents }: CreateTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: [] as string[],
    progress: 0,
    dueDate: '',
    estimatedTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assignedTo: [],
      progress: 0,
      dueDate: '',
      estimatedTime: ''
    });
    onOpenChange(false);
  };

  const toggleAgent = (agentName: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(agentName)
        ? prev.assignedTo.filter(name => name !== agentName)
        : [...prev.assignedTo, agentName]
    }));
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-muted' },
    { value: 'medium', label: 'Medium', color: 'bg-info' },
    { value: 'high', label: 'High', color: 'bg-warning' },
    { value: 'urgent', label: 'Urgent', color: 'bg-destructive' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task in detail..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                placeholder="e.g., Tomorrow, This week..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Estimated Time
              </Label>
              <Input
                id="estimatedTime"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                placeholder="e.g., 2h, 1 day..."
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Assign to Agents
            </Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                    formData.assignedTo.includes(agent.name)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-secondary/50'
                  }`}
                  onClick={() => toggleAgent(agent.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500' :
                        agent.status === 'busy' ? 'bg-yellow-500' :
                        agent.status === 'idle' ? 'bg-gray-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium">{agent.name}</span>
                    </div>
                    {formData.assignedTo.includes(agent.name) && (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{agent.role}</p>
                </div>
              ))}
            </div>
            
            {formData.assignedTo.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.assignedTo.map(agentName => (
                  <Badge key={agentName} variant="secondary" className="gap-1">
                    {agentName}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => toggleAgent(agentName)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}