import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Target, Calendar, Plus } from "lucide-react";
import { Workgroup } from "@/hooks/useWorkgroups";

interface WorkgroupsBoardProps {
  workgroups: Workgroup[];
  onCreateWorkgroup: () => void;
  onWorkgroupSelect: (workgroupId: string) => void;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info text-info-foreground',
  high: 'bg-warning text-warning-foreground',
  urgent: 'bg-destructive text-destructive-foreground'
};

const statusColors = {
  active: 'bg-success text-success-foreground',
  paused: 'bg-warning text-warning-foreground',
  completed: 'bg-info text-info-foreground',
  archived: 'bg-muted text-muted-foreground'
};

export function WorkgroupsBoard({ workgroups, onCreateWorkgroup, onWorkgroupSelect }: WorkgroupsBoardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">AI Workgroups</h2>
        <Button onClick={onCreateWorkgroup} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Workgroup
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workgroups.map((workgroup) => (
          <Card 
            key={workgroup.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50"
            onClick={() => onWorkgroupSelect(workgroup.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">{workgroup.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">{workgroup.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${priorityColors[workgroup.priority]}`}>
                    {workgroup.priority}
                  </Badge>
                  <Badge className={`text-xs ${statusColors[workgroup.status]}`}>
                    {workgroup.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium">Goal:</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 pl-6">
                  {workgroup.goal}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{workgroup.progress}%</span>
                </div>
                <Progress value={workgroup.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{workgroup.agent_ids?.length || 0} agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span>{workgroup.task_ids?.length || 0} tasks</span>
                </div>
              </div>

              {workgroup.deadline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(workgroup.deadline)}</span>
                </div>
              )}

              <div className="pt-2 text-xs text-muted-foreground">
                Created by {workgroup.created_by} • {formatDate(workgroup.created_at)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workgroups.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No workgroups yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI workgroup to start collaborative goal achievement
            </p>
            <Button onClick={onCreateWorkgroup} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Workgroup
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}