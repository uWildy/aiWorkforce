import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Building2, Bot, Users, MessageCircle } from "lucide-react";
import { useAgents } from "@/hooks/useAgents";
import { useOrganizations } from "@/hooks/useBusiness";

interface Organization {
  id: string;
  name: string;
  agentCount: number;
  lastActivity: string;
  status: 'active' | 'idle';
  unreadCount?: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  lastSeen: string;
  unreadCount?: number;
  organizationId: string;
}

interface ContactsListProps {
  onSelectContact: (contact: { type: 'organization' | 'agent'; id: string; name: string }) => void;
  selectedContact?: { type: 'organization' | 'agent'; id: string };
}

export function ContactsList({ onSelectContact, selectedContact }: ContactsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'organizations' | 'agents'>('all');
  
  const { agents: realAgents, loading: agentsLoading } = useAgents();
  const { organizations: realOrganizations } = useOrganizations();

  // Transform real data for contacts list
  const organizations: Organization[] = realOrganizations.map(org => ({
    id: org.id,
    name: org.name,
    agentCount: realAgents.filter(agent => agent.status === 'active').length,
    lastActivity: '2 hours ago', // Could be calculated from last message
    status: 'active' as const,
    unreadCount: Math.floor(Math.random() * 5) // Would come from messages API
  }));

  const agents: Agent[] = realAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    status: agent.status === 'active' ? 'online' : 'offline',
    lastSeen: agent.status === 'active' ? 'now' : '1 hour ago',
    unreadCount: Math.floor(Math.random() * 3), // Would come from messages API
    organizationId: '1' // Would be mapped to actual org
  }));

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'idle':
        return 'bg-orange-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSelectContact = (type: 'organization' | 'agent', id: string, name: string) => {
    onSelectContact({ type, id, name });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b border-border/50 space-y-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Communications
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('all')}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={activeTab === 'organizations' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('organizations')}
            className="text-xs"
          >
            <Building2 className="w-3 h-3 mr-1" />
            Groups
          </Button>
          <Button
            variant={activeTab === 'agents' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('agents')}
            className="text-xs"
          >
            <Bot className="w-3 h-3 mr-1" />
            Agents
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            
            {/* Organizations Section */}
            {(activeTab === 'all' || activeTab === 'organizations') && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  Organization Channels
                </div>
                
                <div className="space-y-2">
                  {filteredOrganizations.map((org) => (
                    <div
                      key={org.id}
                      onClick={() => handleSelectContact('organization', org.id, org.name)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedContact?.type === 'organization' && selectedContact?.id === org.id
                          ? 'bg-accent border border-primary/20'
                          : 'border border-border/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                <Building2 className="w-5 h-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(org.status)}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{org.name}</span>
                              {org.unreadCount && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {org.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              {org.agentCount} agents • {org.lastActivity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Separator */}
            {activeTab === 'all' && (
              <Separator className="my-4" />
            )}

            {/* Agents Section */}
            {(activeTab === 'all' || activeTab === 'agents') && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Bot className="w-4 h-4" />
                  Individual Agents
                </div>
                
                <div className="space-y-2">
                  {filteredAgents.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => handleSelectContact('agent', agent.id, agent.name)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedContact?.type === 'agent' && selectedContact?.id === agent.id
                          ? 'bg-accent border border-primary/20'
                          : 'border border-border/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-secondary/50 text-secondary-foreground text-xs">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(agent.status)}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{agent.name}</span>
                              {agent.unreadCount && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {agent.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {agent.role} • {agent.status === 'online' ? 'Active now' : `Last seen ${agent.lastSeen}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}