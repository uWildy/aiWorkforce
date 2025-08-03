import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, TrendingUp, DollarSign, Target, Calendar, Lightbulb } from "lucide-react";
import { useOrganizations, useAIAgents, useDepartments } from "@/hooks/useBusiness";

export function OrganizationOverview() {
  const { organizations } = useOrganizations();
  const { agents } = useAIAgents();
  const { departments } = useDepartments();
  
  const organization = organizations[0]; // Assuming single org for now

  if (!organization) {
    return <div>Loading organization...</div>;
  }

  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);
  const avgDeptPerformance = departments.reduce((sum, dept) => 
    sum + (dept.kpis.productivity + dept.kpis.efficiency + dept.kpis.satisfaction) / 3, 0
  ) / departments.length;

  return (
    <div className="space-y-6">
      {/* Organization Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{organization.name}</CardTitle>
                <p className="text-muted-foreground">{organization.industry} • Founded {organization.founded}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary">{organization.structure} structure</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{agents.length} AI agents</span>
            </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>${(organization.revenue / 1000000).toFixed(1)}M revenue</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline">
              Edit Organization
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Mission</h4>
              <p className="text-sm text-muted-foreground">{organization.mission}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Vision</h4>
              <p className="text-sm text-muted-foreground">{organization.vision}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Core Values</h4>
              <div className="flex flex-wrap gap-1">
                {organization.values.map((value, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {departments.length} departments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Annual departmental budgets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDeptPerformance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Organization-wide efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {dept.employeeCount} employees • ${(dept.budget / 1000000).toFixed(1)}M budget
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-medium">{dept.kpis.productivity}%</div>
                    <div className="text-xs text-muted-foreground">Productivity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{dept.kpis.efficiency}%</div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{dept.kpis.satisfaction}%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Hire New Employee</h3>
              <p className="text-sm text-muted-foreground">Expand your workforce</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Start New Project</h3>
              <p className="text-sm text-muted-foreground">Create business initiatives</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">AI Optimization</h3>
              <p className="text-sm text-muted-foreground">Enhance AI capabilities</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}