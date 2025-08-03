import { useState } from "react"
import { Building2, Users, Target, TrendingUp, Settings, FileText, MessageCircle, BarChart3, Briefcase } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const businessItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Organizations", url: "/organizations", icon: Building2 },
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Departments", url: "/departments", icon: Briefcase },
  { title: "Projects", url: "/projects", icon: Target },
  { title: "Performance", url: "/performance", icon: TrendingUp },
  { title: "Communications", url: "/communications", icon: MessageCircle },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function BusinessSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path || (path !== "/" && currentPath.startsWith(path))
  const isExpanded = businessItems.some((i) => isActive(i.url))
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50"

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-foreground">AI Workforce</h2>
              <p className="text-xs text-muted-foreground">Enterprise Management</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Operations</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}