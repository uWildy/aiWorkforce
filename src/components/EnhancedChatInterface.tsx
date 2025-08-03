import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, Paperclip, Smile, Building2, Users, Phone, Video, MoreHorizontal, Zap } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  senderType: 'human' | 'agent';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  agentId?: string;
}

interface EnhancedChatInterfaceProps {
  selectedContact?: { type: 'organization' | 'agent'; id: string; name: string };
  onSendMessage: (message: string, recipient: string) => void;
}

export function EnhancedChatInterface({ selectedContact, onSendMessage }: EnhancedChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Use the existing useMessages hook for agent conversations
  const { messages: agentMessages, sendMessage, sendAIMessage, loading } = useMessages(
    selectedContact?.type === 'agent' ? selectedContact.id : undefined
  );

  // Mock messages for organization channels
  const [orgMessages, setOrgMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Marketing AI Alpha',
      senderType: 'agent',
      content: 'Campaign performance metrics updated. ROI increased by 15% this quarter.',
      timestamp: '10:30 AM',
      status: 'read',
      agentId: '1'
    },
    {
      id: '2',
      sender: 'Creative AI Delta',
      senderType: 'agent',
      content: 'New content assets ready for approval. Shall I proceed with publishing?',
      timestamp: '10:32 AM',
      status: 'read',
      agentId: '4'
    },
    {
      id: '3',
      sender: 'You',
      senderType: 'human',
      content: 'Great work team! Please proceed with publishing and keep monitoring the metrics.',
      timestamp: '10:35 AM',
      status: 'delivered'
    }
  ]);

  const currentMessages = selectedContact?.type === 'organization' ? orgMessages : agentMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedContact) return;

    const messageText = message.trim();
    setMessage("");

    try {
      if (selectedContact.type === 'agent') {
        // Send to individual agent
        await sendMessage(messageText);
        
        // Auto-send AI response after a short delay
        setTimeout(async () => {
          try {
            await sendAIMessage(messageText);
          } catch (error) {
            console.error('Error sending AI message:', error);
            toast({
              title: "AI Response Failed",
              description: "Could not get AI response. Please try again.",
              variant: "destructive",
            });
          }
        }, 1000);
      } else {
        // Send to organization channel
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: 'You',
          senderType: 'human',
          content: messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };
        
        setOrgMessages([...orgMessages, newMessage]);
        onSendMessage(messageText, selectedContact.id);
        toast({
          title: "Message Sent",
          description: `Message sent to ${selectedContact.name}`,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Failed",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getParticipantsList = () => {
    if (selectedContact?.type === 'organization') {
      // Mock participants for organization
      return [
        { id: '1', name: 'Marketing AI Alpha', status: 'online' },
        { id: '4', name: 'Creative AI Delta', status: 'busy' },
        { id: '7', name: 'Analytics AI Epsilon', status: 'offline' },
        { id: '9', name: 'Strategy AI Zeta', status: 'online' }
      ];
    }
    return [];
  };

  const participants = getParticipantsList();

  if (!selectedContact) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Welcome to AI Communications</h3>
          <p className="text-muted-foreground">
            Select an organization channel or individual agent to start chatting
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={selectedContact.type === 'organization' ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-secondary-foreground'}>
                {selectedContact.type === 'organization' ? <Building2 className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {selectedContact.name}
                {selectedContact.type === 'organization' && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {participants.length} agents
                  </Badge>
                )}
              </CardTitle>
              {selectedContact.type === 'organization' ? (
                <div className="text-sm text-muted-foreground">
                  {participants.filter(p => p.status === 'online').length} online • {participants.length} total
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Individual conversation
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Participants bar for organization channels */}
        {selectedContact.type === 'organization' && participants.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center gap-2 py-2">
              <span className="text-xs font-medium text-muted-foreground">Active participants:</span>
              <div className="flex items-center gap-1">
                {participants.slice(0, 6).map((participant) => (
                  <div key={participant.id} className="relative">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-secondary/50">
                        <Bot className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${
                      participant.status === 'online' ? 'bg-green-500' : 
                      participant.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                  </div>
                ))}
                {participants.length > 6 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    +{participants.length - 6}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.senderType === 'human' && msg.sender === 'You' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={`text-xs ${
                    msg.senderType === 'human' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent/20 text-accent-foreground'
                  }`}>
                    {msg.senderType === 'human' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-[80%] ${
                  msg.senderType === 'human' && msg.sender === 'You' ? 'text-right' : 'text-left'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-foreground">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    {msg.senderType === 'agent' && <Zap className="h-3 w-3 text-primary" />}
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    msg.senderType === 'human' && msg.sender === 'You'
                      ? 'bg-primary text-primary-foreground'
                      : msg.senderType === 'agent'
                      ? 'bg-accent/20 text-accent-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  
                  {msg.senderType === 'human' && msg.sender === 'You' && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {msg.status === 'sent' && '✓'}
                      {msg.status === 'delivered' && '✓✓'}
                      {msg.status === 'read' && '✓✓ Read'}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && selectedContact?.type === 'agent' && (
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-accent/20 text-accent-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-accent/20 p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="px-2">
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Input
              placeholder={
                selectedContact.type === 'agent' 
                  ? "Ask your AI agent anything..." 
                  : `Message ${selectedContact.name}...`
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={loading}
              className="flex-1"
            />
            
            <Button variant="ghost" size="sm" className="px-2">
              <Smile className="w-4 h-4" />
            </Button>
            
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || loading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}