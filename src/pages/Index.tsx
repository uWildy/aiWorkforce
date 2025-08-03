import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BusinessSidebar } from "@/components/BusinessSidebar";
import { OrganizationOverview } from "@/components/OrganizationOverview";
import { EmployeeManagement } from "@/components/EmployeeManagement";
import { DepartmentManagement } from "@/components/DepartmentManagement";
import { TaskManagement } from "@/components/TaskManagement";
import { PerformanceDashboard } from "@/components/PerformanceDashboard";
import { CommunicationsDashboard } from "@/components/CommunicationsDashboard";
import { FileManager } from "@/components/FileManager";
import { SettingsDashboard } from "@/components/SettingsDashboard";

const Index = () => {
  const location = useLocation();
  
  const renderCurrentPage = () => {
    switch (location.pathname) {
      case '/organizations':
        return <OrganizationOverview />;
      case '/employees':
        return <EmployeeManagement />;
      case '/departments':
        return <DepartmentManagement />;
      case '/projects':
        return <TaskManagement />;
      case '/performance':
        return <PerformanceDashboard />;
      case '/communications':
        return <CommunicationsDashboard />;
      case '/documents':
        return <FileManager agentId="" />;
      case '/settings':
        return <SettingsDashboard />;
      default:
        return <PerformanceDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Global Header */}
        <header className="fixed top-0 left-0 right-0 h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <SidebarTrigger className="ml-2" />
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-sm font-medium text-foreground">AI Workforce Enterprise Management System</h1>
          </div>
        </header>

        <div className="flex w-full pt-12">
          <BusinessSidebar />
          
          <main className="flex-1 p-6 overflow-auto">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;