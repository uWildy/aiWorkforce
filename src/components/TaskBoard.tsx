import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, User, Target, ChevronRight } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  assignedTo: string[];
  progress: number;
  dueDate: string;
  estimatedTime: string;
}

interface TaskBoardProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info text-info-foreground',
  high: 'bg-warning text-warning-foreground',
  urgent: 'bg-destructive text-destructive-foreground'
};

const statusColors = {
  pending: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-info text-info-foreground',
  review: 'bg-warning text-warning-foreground',
  completed: 'bg-success text-success-foreground'
};

export function TaskBoard({ tasks, onTaskSelect }: TaskBoardProps) {
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const columns = [
    { id: 'pending', title: 'Pending', tasks: getTasksByStatus('pending') },
    { id: 'in-progress', title: 'In Progress', tasks: getTasksByStatus('in-progress') },
    { id: 'review', title: 'Review', tasks: getTasksByStatus('review') },
    { id: 'completed', title: 'Completed', tasks: getTasksByStatus('completed') }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map(column => (
        <div key={column.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">{column.title}</h3>
            <Badge variant="outline" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {column.tasks.map(task => (
              <Card 
                key={task.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-border/50"
                onClick={() => onTaskSelect(task.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {task.title}
                    </CardTitle>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`text-xs ${statusColors[task.status]}`}>
                      {task.status}
                    </Badge>
                  </div>
                  
                  {task.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-1" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{task.assignedTo.length} agent{task.assignedTo.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.estimatedTime}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Due: {task.dueDate}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}