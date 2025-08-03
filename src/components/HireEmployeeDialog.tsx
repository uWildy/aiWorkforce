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

interface HireEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (employeeData: any) => void;
}

export function HireEmployeeDialog({ open, onOpenChange, onSubmit }: HireEmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'Engineering',
    level: 'junior',
    salary: 75000,
    email: '',
    phone: '',
    skills: [] as string[],
    aiModel: 'grok-4',
    apiKey: '',
    autonomyLevel: 'semi-autonomous'
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'active',
      performance: 75,
      aiCapabilities: {
        model: formData.aiModel,
        apiKey: formData.apiKey,
        specializations: formData.skills,
        autonomyLevel: formData.autonomyLevel
      },
      metrics: {
        tasksCompleted: 0,
        projectsLed: 0,
        efficiency: 75,
        collaborationScore: 85
      }
    });
    setFormData({
      name: '', position: '', department: 'Engineering', level: 'junior',
      salary: 75000, email: '', phone: '', skills: [], aiModel: 'grok-4',
      apiKey: '', autonomyLevel: 'semi-autonomous'
    });
    onOpenChange(false);
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hire New Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Position *</Label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Senior Developer"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intern">Intern</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Annual Salary</Label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@company.ai"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1-555-0123"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>AI Capabilities</Label>
            <div className="grid grid-cols-2 gap-4">
              <Select value={formData.aiModel} onValueChange={(value) => setFormData(prev => ({ ...prev, aiModel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="AI Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grok-4">Grok 4</SelectItem>
                  <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                  <SelectItem value="claude-4">Claude 4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.autonomyLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, autonomyLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Autonomy Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervised">Supervised</SelectItem>
                  <SelectItem value="semi-autonomous">Semi-Autonomous</SelectItem>
                  <SelectItem value="autonomous">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="API Key (optional)"
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <Label>Skills & Specializations</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill}>Add</Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Hire Employee</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}