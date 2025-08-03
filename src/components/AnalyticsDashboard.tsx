import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Users, MessageSquare, CheckCircle, AlertCircle, Clock, Zap, RefreshCw } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { useTasks } from '@/hooks/useTasks';
import { useWorkgroups } from '@/hooks/useWorkgroups';
import { apiService } from '@/services/apiService';

const performanceData = [
  { time: '00:00', efficiency: 85, tasks: 12, messages: 45 },
  { time: '04:00', efficiency: 78, tasks: 8, messages: 32 },
  { time: '08:00', efficiency: 92, tasks: 25, messages: 78 },
  { time: '12:00', efficiency: 89, tasks: 31, messages: 95 },
  { time: '16:00', efficiency: 94, tasks: 28, messages: 87 },
  { time: '20:00', efficiency: 87, tasks: 18, messages: 56 }
];

const agentTypeData = [
  { name: 'Analytics', value: 30, color: '#8884d8' },
  { name: 'Support', value: 25, color: '#82ca9d' },
  { name: 'Marketing', value: 20, color: '#ffc658' },
  { name: 'Content', value: 15, color: '#ff7300' },
  { name: 'Other', value: 10, color: '#0088fe' }
];

export function AnalyticsDashboard() {
  const { agents, loading: agentsLoading } = useAgents();
  const { tasks, loading: tasksLoading } = useTasks();
  const { workgroups, loading: workgroupsLoading } = useWorkgroups();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [backendHealth, setBackendHealth] = useState<any>(null);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      setConnectionStatus('checking');
      const response = await fetch('http://localhost/ai-workforce/api/health.php');
      if (response.ok) {
        const data = await response.json();
        setBackendHealth(data);
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const getAgentStats = () => {
    if (agentsLoading || !agents.length) {
      return {
        total: 0,
        active: 0,
        efficiency: 0,
        totalTasks: 0
      };
    }

    return {
      total: agents.length,
      active: agents.filter(a => a.status === 'active').length,
      efficiency: Math.round(agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length),
      totalTasks: agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)
    };
  };

  const getTaskStats = () => {
    if (tasksLoading || !tasks.length) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0
      };
    }

    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      pending: tasks.filter(t => t.status === 'pending').length
    };
  };

  const getWorkgroupStats = () => {
    if (workgroupsLoading || !workgroups.length) {
      return {
        total: 0,
        active: 0,
        avgProgress: 0
      };
    }

    return {
      total: workgroups.length,
      active: workgroups.filter(w => w.status === 'active').length,
      avgProgress: Math.round(workgroups.reduce((sum, w) => sum + w.progress, 0) / workgroups.length)
    };
  };

  const agentStats = getAgentStats();
  const taskStats = getTaskStats();
  const workgroupStats = getWorkgroupStats();

  return (
    <div className="space-y-6">
      {/* Backend Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium">
                  Backend Status: {connectionStatus === 'connected' ? 'Connected' : 
                                  connectionStatus === 'checking' ? 'Checking...' : 'Disconnected'}
                </p>
                {backendHealth && (
                  <p className="text-sm text-muted-foreground">
                    Grok4, GPT-4, Claude available • {backendHealth.timestamp}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkBackendHealth}
              disabled={connectionStatus === 'checking'}
            >
              <RefreshCw className={`w-4 h-4 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Error Alert */}
      {connectionStatus === 'disconnected' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Backend Disconnected:</strong> Ensure WAMP is running and backend files are at 
            <code className="mx-1 px-1 bg-muted rounded">C:\wamp64\www\ai-workforce\api\</code>
            <br />
            <small>Check: Apache service, MySQL service, and database setup</small>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{agentStats.total}</p>
                <p className="text-xs text-green-600">{agentStats.active} active</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl font-bold">{agentStats.efficiency}%</p>
                <p className="text-xs text-blue-600">Grok4 Enhanced</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
                <p className="text-xs text-green-600">{taskStats.inProgress} in progress</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Workgroups</p>
                <p className="text-2xl font-bold">{workgroupStats.total}</p>
                <p className="text-xs text-purple-600">{workgroupStats.avgProgress}% avg progress</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#8884d8" name="Efficiency %" strokeWidth={2} />
                <Line type="monotone" dataKey="tasks" stroke="#82ca9d" name="Tasks Completed" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Agent Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Task Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Task Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { status: 'Completed', count: taskStats.completed, fill: '#22c55e' },
              { status: 'In Progress', count: taskStats.inProgress, fill: '#3b82f6' },
              { status: 'Pending', count: taskStats.pending, fill: '#f59e0b' },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Agent Activity & AI Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agents.slice(0, 5).map((agent, index) => (
              <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' : 
                    agent.status === 'busy' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.currentTask || 'No active task'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{agent.model || 'gpt-4'}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{agent.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}