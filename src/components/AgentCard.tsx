import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Activity, Settings } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  tasksCompleted: number;
  currentTask?: string;
  lastActive: string;
  efficiency: number;
}

interface AgentCardProps {
  agent: Agent;
  onMessage: (agentId: string) => void;
  onConfigure: (agentId: string) => void;
}

const statusColors = {
  active: 'bg-agent-active',
  idle: 'bg-agent-idle', 
  busy: 'bg-agent-busy',
  offline: 'bg-agent-offline'
};

const statusLabels = {
  active: 'Active',
  idle: 'Idle',
  busy: 'Busy',
  offline: 'Offline'
};

export function AgentCard({ agent, onMessage, onConfigure }: AgentCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(agent.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
            <Badge variant="outline" className="text-xs">
              {statusLabels[agent.status]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-secondary/50 p-2 rounded-md">
            <div className="font-medium text-foreground">{agent.tasksCompleted}</div>
            <div className="text-muted-foreground">Tasks Done</div>
          </div>
          <div className="bg-secondary/50 p-2 rounded-md">
            <div className="font-medium text-foreground">{agent.efficiency}%</div>
            <div className="text-muted-foreground">Efficiency</div>
          </div>
        </div>
        
        {agent.currentTask && (
          <div className="p-2 bg-primary/10 rounded-md">
            <div className="text-xs font-medium text-foreground mb-1">Current Task</div>
            <div className="text-xs text-muted-foreground">{agent.currentTask}</div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Last active: {agent.lastActive}
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs"
            onClick={() => onMessage(agent.id)}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Message
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2"
            onClick={() => onConfigure(agent.id)}
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}