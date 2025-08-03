import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, Target, DollarSign, Clock, Award, Zap } from "lucide-react";
import { useAIAgents, useDepartments, useOrganizations } from "@/hooks/useBusiness";

export function PerformanceDashboard() {
  const { agents } = useAIAgents();
  const { departments } = useDepartments();
  const { organizations } = useOrganizations();

  const organization = organizations[0];
  const avgUptime = agents.reduce((sum, agent) => sum + agent.metrics.uptime, 0) / agents.length || 0;
  const totalTasksCompleted = agents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0);
  const avgResponseTime = agents.reduce((sum, agent) => sum + agent.metrics.responseTime, 0) / agents.length || 0;
  const totalApiCalls = agents.reduce((sum, agent) => sum + agent.metrics.apiCallsMade, 0);

  const topPerformers = agents
    .sort((a, b) => b.metrics.uptime - a.metrics.uptime)
    .slice(0, 5);

  const departmentPerformance = departments.map(dept => {
    const deptAgents = agents.filter(agent => agent.department === dept.name);
    const avgDeptUptime = deptAgents.reduce((sum, agent) => sum + agent.metrics.uptime, 0) / deptAgents.length || 0;
    const totalDeptTasks = deptAgents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0);
    
    return {
      ...dept,
      avgPerformance: avgDeptUptime,
      totalTasks: totalDeptTasks,
      employeeCount: deptAgents.length
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Performance Analytics</h1>
        <p className="text-muted-foreground">Track organizational performance and employee metrics</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(organization?.revenue / 1000000).toFixed(1)}M</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% from last quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUptime.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.1% this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasksCompleted}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +156 this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              -15ms this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentPerformance.map((dept) => (
              <div key={dept.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{dept.name}</h4>
                    <Badge variant="outline">{dept.employeeCount} employees</Badge>
                  </div>
                  <div className="text-sm font-medium">{dept.avgPerformance.toFixed(1)}%</div>
                </div>
                <Progress value={dept.avgPerformance} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Budget: ${(dept.budget / 1000000).toFixed(1)}M</span>
                  <span>Tasks: {dept.totalTasks}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((agent, index) => (
                <div key={agent.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{agent.metrics.uptime}%</p>
                    <p className="text-sm text-muted-foreground">{agent.metrics.tasksCompleted} tasks</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total API Calls</span>
                <span className="font-medium">{totalApiCalls.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium">${(organization?.revenue / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Efficiency Score</span>
                <span className="font-medium text-green-600">
                  {avgUptime.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agents per Dept</span>
                <span className="font-medium">{(agents.length / departments.length).toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>AI Workforce Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Average Uptime</h4>
              <div className="text-2xl font-bold text-primary">{avgUptime.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Across all AI agents</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Autonomous Agents</h4>
              <div className="text-2xl font-bold text-blue-600">
                {agents.filter(a => a.autonomyLevel === 'autonomous').length}
              </div>
              <p className="text-sm text-muted-foreground">Fully autonomous workers</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium mb-2">AI Models Used</h4>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(agents.map(a => a.capabilities.model)).size}
              </div>
              <p className="text-sm text-muted-foreground">Different AI technologies</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}