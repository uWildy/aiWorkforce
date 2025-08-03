import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkgroupsBoard } from "@/components/WorkgroupsBoard";
import { CreateWorkgroupDialog } from "@/components/CreateWorkgroupDialog";
import { useWorkgroups, Workgroup } from "@/hooks/useWorkgroups";
import { useAgents } from "@/hooks/useAgents";
import { useTasks } from "@/hooks/useTasks";
import { Search, Plus, Users, Target, Activity, Clock } from "lucide-react";

export function WorkgroupManagement() {
  const { workgroups, loading, createWorkgroup, updateWorkgroup } = useWorkgroups();
  const { agents } = useAgents();
  const { tasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedWorkgroup, setSelectedWorkgroup] = useState<Workgroup | null>(null);

  const handleCreateWorkgroup = async (workgroupData: Omit<Workgroup, 'id' | 'created_at' | 'updated_at'>) => {
    const success = await createWorkgroup(workgroupData);
    if (success) {
      setShowCreateDialog(false);
    }
  };

  const handleWorkgroupSelect = (workgroupId: string) => {
    const workgroup = workgroups.find(w => w.id === workgroupId);
    if (workgroup) {
      setSelectedWorkgroup(workgroup);
      // TODO: Open workgroup details modal
    }
  };

  const filteredWorkgroups = workgroups.filter(workgroup => {
    const matchesSearch = workgroup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workgroup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workgroup.goal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || workgroup.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || workgroup.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const workgroupStats = {
    total: workgroups.length,
    active: workgroups.filter(w => w.status === 'active').length,
    completed: workgroups.filter(w => w.status === 'completed').length,
    totalAgents: workgroups.reduce((sum, w) => sum + (w.agent_ids?.length || 0), 0),
    totalTasks: workgroups.reduce((sum, w) => sum + (w.task_ids?.length || 0), 0)
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading workgroups...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workgroup Management</h1>
          <p className="text-muted-foreground">Manage collaborative AI teams</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Workgroup
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workgroupStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workgroupStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workgroupStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workgroupStats.totalAgents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workgroupStats.totalTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search workgroups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workgroups Board */}
      <WorkgroupsBoard 
        workgroups={filteredWorkgroups} 
        onCreateWorkgroup={() => setShowCreateDialog(true)}
        onWorkgroupSelect={handleWorkgroupSelect}
      />

      {/* Create Workgroup Dialog */}
      <CreateWorkgroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateWorkgroup}
        agents={agents}
        tasks={tasks}
      />
    </div>
  );
}