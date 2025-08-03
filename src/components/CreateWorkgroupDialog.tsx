import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Agent } from "@/hooks/useAgents";
import { Task } from "@/hooks/useTasks";

interface CreateWorkgroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (workgroupData: any) => void;
  agents: Agent[];
  tasks: Task[];
}

export function CreateWorkgroupDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  agents, 
  tasks 
}: CreateWorkgroupDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    priority: 'medium',
    status: 'active',
    deadline: '',
    agent_ids: [] as string[],
    task_ids: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      created_by: 'Admin',
      progress: 0
    });
    setFormData({
      name: '',
      description: '',
      goal: '',
      priority: 'medium',
      status: 'active',
      deadline: '',
      agent_ids: [],
      task_ids: []
    });
    onOpenChange(false);
  };

  const addAgent = (agentId: string) => {
    if (!formData.agent_ids.includes(agentId)) {
      setFormData(prev => ({
        ...prev,
        agent_ids: [...prev.agent_ids, agentId]
      }));
    }
  };

  const removeAgent = (agentId: string) => {
    setFormData(prev => ({
      ...prev,
      agent_ids: prev.agent_ids.filter(id => id !== agentId)
    }));
  };

  const addTask = (taskId: string) => {
    if (!formData.task_ids.includes(taskId)) {
      setFormData(prev => ({
        ...prev,
        task_ids: [...prev.task_ids, taskId]
      }));
    }
  };

  const removeTask = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      task_ids: prev.task_ids.filter(id => id !== taskId)
    }));
  };

  const getAgentName = (agentId: string) => {
    return agents.find(agent => agent.id === agentId)?.name || agentId;
  };

  const getTaskTitle = (taskId: string) => {
    return tasks.find(task => task.id === taskId)?.title || taskId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workgroup</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workgroup Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Marketing Campaign Team"
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
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
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
              placeholder="Brief description of the workgroup's purpose"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Goal *</Label>
            <Textarea
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="What specific goal should this workgroup achieve?"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Assign Agents</Label>
            <Select onValueChange={addAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select agents to add..." />
              </SelectTrigger>
              <SelectContent>
                {agents.filter(agent => !formData.agent_ids.includes(agent.id)).map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} - {agent.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.agent_ids.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.agent_ids.map(agentId => (
                  <Badge key={agentId} variant="secondary" className="gap-1">
                    {getAgentName(agentId)}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeAgent(agentId)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label>Assign Tasks</Label>
            <Select onValueChange={addTask}>
              <SelectTrigger>
                <SelectValue placeholder="Select tasks to add..." />
              </SelectTrigger>
              <SelectContent>
                {tasks.filter(task => !formData.task_ids.includes(task.id)).map(task => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title} - {task.priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.task_ids.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.task_ids.map(taskId => (
                  <Badge key={taskId} variant="secondary" className="gap-1">
                    {getTaskTitle(taskId)}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeTask(taskId)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Workgroup</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}