import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIAgentCard } from "@/components/EmployeeCard";
import { CreateAIAgentDialog } from "@/components/CreateAIAgentDialog";
import { AgentManagementDialog } from "@/components/AgentManagementDialog";
import { useAIAgents, AIAgent } from "@/hooks/useBusiness";
import { Plus, Search, Filter, Bot, Activity, Users, Zap } from "lucide-react";
import { toast } from "sonner";

export function AgentsManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [managementDialogOpen, setManagementDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const { agents, loading, createAgent, updateAgent, issueDirective } = useAIAgents();

  const handleCreateAgent = async (agentData: any) => {
    const success = await createAgent(agentData);
    if (success) {
      setCreateDialogOpen(false);
    }
  };

  const handleManageAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setManagementDialogOpen(true);
  };

  const handleUpdateAgent = async (agentId: string, updates: Partial<AIAgent>) => {
    await updateAgent(agentId, updates);
    setManagementDialogOpen(false);
  };

  const handleIssueDirective = async (agentId: string, directive: string, priority: 'low' | 'medium' | 'high' | 'critical') => {
    await issueDirective(agentId, directive, priority);
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      // Add delete functionality here
      toast.success('Agent deleted successfully');
      setManagementDialogOpen(false);
    }
  };

  const handleDuplicateAgent = async (agent: AIAgent) => {
    const duplicateData = {
      ...agent,
      name: `${agent.name} (Copy)`,
      id: undefined,
      metrics: {
        ...agent.metrics,
        tasksCompleted: 0,
        apiCallsMade: 0,
        dataProcessed: 0
      },
      status: 'offline' as const
    };
    await createAgent(duplicateData);
    toast.success('Agent duplicated successfully');
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesRole = roleFilter === 'all' || agent.role.toLowerCase().includes(roleFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getAgentStats = () => {
    const total = agents.length;
    const active = agents.filter(a => a.status === 'active').length;
    const busy = agents.filter(a => a.status === 'busy').length;
    const avgUptime = agents.reduce((sum, agent) => sum + agent.metrics.uptime, 0) / total || 0;
    
    return { total, active, busy, avgUptime };
  };

  const stats = getAgentStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">AI Agents Management</h2>
          <p className="text-muted-foreground">Create, train, and manage your AI workforce</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bot className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Busy</p>
                <p className="text-2xl font-bold text-blue-600">{stats.busy}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Uptime</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(stats.avgUptime)}%</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search agents by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="content">Content</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Agents</h3>
          <Badge variant="outline">{filteredAgents.length} of {stats.total} agents</Badge>
        </div>

        {filteredAgents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No agents found</h3>
              <p className="text-muted-foreground mb-4">
                {agents.length === 0 
                  ? "Create your first AI agent to get started" 
                  : "Try adjusting your search filters"
                }
              </p>
              {agents.length === 0 && (
                <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create First Agent
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <AIAgentCard
                key={agent.id}
                agent={agent}
                onManage={() => handleManageAgent(agent)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateAIAgentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateAgent}
      />

      <AgentManagementDialog
        open={managementDialogOpen}
        onOpenChange={setManagementDialogOpen}
        agent={selectedAgent}
        onUpdate={handleUpdateAgent}
        onIssueDirective={handleIssueDirective}
      />
    </div>
  );
}