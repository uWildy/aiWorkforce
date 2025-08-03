import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, TrendingUp, Star, Phone, Mail, Calendar, Briefcase } from "lucide-react";
import { AIAgent } from "@/hooks/useBusiness";

interface AIAgentCardProps {
  agent: AIAgent;
  onManage: () => void;
  supervisor?: AIAgent;
}

const autonomyColors = {
  supervised: 'bg-orange-100 text-orange-800 border-orange-200',
  'semi-autonomous': 'bg-blue-100 text-blue-800 border-blue-200',
  autonomous: 'bg-green-100 text-green-800 border-green-200'
};

const statusColors = {
  active: 'bg-green-500',
  idle: 'bg-yellow-500',
  busy: 'bg-blue-500',
  offline: 'bg-red-500'
};

export function AIAgentCard({ agent, onManage, supervisor }: AIAgentCardProps) {
  const initials = agent.name.split(' ').map(n => n[0]).join('');
  
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${statusColors[agent.status]}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{agent.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{agent.department}</span>
              </div>
            </div>
          </div>
          <Badge className={`text-xs ${autonomyColors[agent.autonomyLevel]}`}>
            {agent.autonomyLevel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Uptime Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uptime</span>
            <span className="font-medium">{agent.metrics.uptime}%</span>
          </div>
          <Progress value={agent.metrics.uptime} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{agent.metrics.tasksCompleted} tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>{agent.metrics.apiCallsMade} API calls</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span>{agent.metrics.dataProcessed}MB data</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>{agent.metrics.responseTime}ms avg</span>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">AI Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.specializations.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {agent.capabilities.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{agent.capabilities.specializations.length - 3}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Model: {agent.capabilities.model}
          </div>
        </div>

        {/* External APIs */}
        {agent.capabilities.externalAPIs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">External APIs</h4>
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.externalAPIs.slice(0, 2).map((api, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {api}
                </Badge>
              ))}
              {agent.capabilities.externalAPIs.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{agent.capabilities.externalAPIs.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Datasets */}
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Created: {new Date(agent.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Briefcase className="w-3 h-3" />
            <span>{agent.datasets.length} datasets loaded</span>
          </div>
        </div>

        {/* Supervisor Info */}
        {supervisor && (
          <div className="text-xs text-muted-foreground border-t pt-2">
            Supervised by: <span className="font-medium">{supervisor.name}</span>
          </div>
        )}

        {/* Action Button */}
        <Button onClick={onManage} variant="outline" className="w-full">
          Manage AI Agent
        </Button>
      </CardContent>
    </Card>
  );
}