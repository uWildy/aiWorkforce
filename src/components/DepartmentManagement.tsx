import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, Target, TrendingUp, DollarSign, Plus } from "lucide-react";
import { useDepartments, Department } from "@/hooks/useBusiness";

export function DepartmentManagement() {
  const { departments } = useDepartments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Management</h1>
          <p className="text-muted-foreground">Organize teams and manage departmental operations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Department
        </Button>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{department.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{department.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Budget & Employees */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <p className="text-lg font-bold">${(department.budget / 1000000).toFixed(1)}M</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Employees</span>
                  </div>
                  <p className="text-lg font-bold">{department.employeeCount}</p>
                </div>
              </div>

              {/* KPIs */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Performance KPIs</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Productivity</span>
                    <span className="font-medium">{department.kpis.productivity}%</span>
                  </div>
                  <Progress value={department.kpis.productivity} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className="font-medium">{department.kpis.efficiency}%</span>
                  </div>
                  <Progress value={department.kpis.efficiency} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Satisfaction</span>
                    <span className="font-medium">{department.kpis.satisfaction}%</span>
                  </div>
                  <Progress value={department.kpis.satisfaction} className="h-2" />
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Department Goals</h4>
                <div className="space-y-1">
                  {department.goals.slice(0, 2).map((goal, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Target className="w-3 h-3 text-primary" />
                      <span className="text-muted-foreground">{goal}</span>
                    </div>
                  ))}
                  {department.goals.length > 2 && (
                    <p className="text-xs text-muted-foreground pl-5">
                      +{department.goals.length - 2} more goals
                    </p>
                  )}
                </div>
              </div>

              {/* Average Performance */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Performance</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium">
                      {Math.round((department.kpis.productivity + department.kpis.efficiency + department.kpis.satisfaction) / 3)}%
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Manage Department
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}