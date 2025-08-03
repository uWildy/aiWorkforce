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
import { Search, Plus, Users, TrendingUp, DollarSign, UserCheck } from "lucide-react";

export function EmployeeManagement() {
  const { agents, loading, createAgent, updateAgent, issueDirective } = useAIAgents();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [autonomyFilter, setAutonomyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);

  const handleCreateAgent = async (agentData: any) => {
    const success = await createAgent(agentData);
    if (success) {
      setShowCreateDialog(false);
    }
  };

  const handleManageAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setShowManageDialog(true);
  };

  const handleUpdateAgent = async (id: string, updates: Partial<AIAgent>) => {
    const success = await updateAgent(id, updates);
    if (success) {
      setShowManageDialog(false);
    }
  };

  const handleIssueDirective = async (agentId: string, directive: string, priority: 'low' | 'medium' | 'high' | 'critical') => {
    await issueDirective(agentId, directive, priority);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || agent.department === departmentFilter;
    const matchesAutonomy = autonomyFilter === "all" || agent.autonomyLevel === autonomyFilter;
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesAutonomy && matchesStatus;
  });

  const agentStats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    totalUptime: agents.length > 0 ? agents.reduce((sum, a) => sum + a.metrics.uptime, 0) / agents.length : 0,
    totalTasks: agents.reduce((sum, a) => sum + a.metrics.tasksCompleted, 0)
  };

  const uniqueDepartments = Array.from(new Set(agents.map(a => a.department)));
  
  // Helper to find supervisor
  const findSupervisor = (agent: AIAgent) => {
    return agent.supervisorId ? agents.find(a => a.id === agent.supervisorId) : undefined;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading AI agents...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Agent Management</h1>
          <p className="text-muted-foreground">Manage your AI workforce and capabilities</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create AI Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {agentStats.active} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.active}</div>
            <p className="text-xs text-muted-foreground">
              {agentStats.total > 0 ? ((agentStats.active / agentStats.total) * 100).toFixed(1) : 0}% active rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.totalUptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              System reliability
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Total throughput
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {uniqueDepartments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={autonomyFilter} onValueChange={setAutonomyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by autonomy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="supervised">Supervised</SelectItem>
            <SelectItem value="semi-autonomous">Semi-Autonomous</SelectItem>
            <SelectItem value="autonomous">Autonomous</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <AIAgentCard
            key={agent.id}
            agent={agent}
            onManage={() => handleManageAgent(agent)}
            supervisor={findSupervisor(agent)}
          />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No AI agents found</h3>
            <p className="text-muted-foreground mb-4">
              {agents.length === 0 
                ? "Start building your AI workforce by creating your first agent"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create AI Agent
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateAIAgentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateAgent}
      />

      <AgentManagementDialog
        open={showManageDialog}
        onOpenChange={setShowManageDialog}
        agent={selectedAgent}
        onUpdate={handleUpdateAgent}
        onIssueDirective={handleIssueDirective}
      />
    </div>
  );
}