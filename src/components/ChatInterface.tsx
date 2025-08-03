import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Paperclip, Smile } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  senderType: 'human' | 'agent';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatInterfaceProps {
  selectedAgent?: string;
  onSendMessage: (message: string, recipient: string) => void;
}

export function ChatInterface({ selectedAgent, onSendMessage }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Operations AI',
      senderType: 'agent',
      content: 'Hello! I\'m ready to assist with workflow coordination. What tasks need to be organized today?',
      timestamp: '10:30 AM',
      status: 'read'
    },
    {
      id: '2',
      sender: 'Marketing AI',
      senderType: 'agent',
      content: 'Campaign analytics are ready for review. Customer engagement is up 23% this week.',
      timestamp: '10:32 AM',
      status: 'read'
    },
    {
      id: '3',
      sender: 'You',
      senderType: 'human',
      content: 'Great work team! Let\'s focus on the priority tasks for this afternoon.',
      timestamp: '10:35 AM',
      status: 'delivered'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedAgent) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderType: 'human',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      
      setMessages([...messages, newMessage]);
      onSendMessage(message, selectedAgent);
      setMessage("");
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Team Communication</CardTitle>
          {selectedAgent && (
            <Badge variant="outline" className="text-xs">
              Chatting with {selectedAgent}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.senderType === 'human' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={`text-xs ${
                  msg.senderType === 'human' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {msg.senderType === 'human' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex-1 max-w-[80%] ${
                msg.senderType === 'human' ? 'text-right' : 'text-left'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-foreground">{msg.sender}</span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                
                <div className={`p-3 rounded-lg ${
                  msg.senderType === 'human'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                
                {msg.senderType === 'human' && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {msg.status === 'sent' && '✓'}
                    {msg.status === 'delivered' && '✓✓'}
                    {msg.status === 'read' && '✓✓ Read'}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="px-2">
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Input
              placeholder={selectedAgent ? `Message ${selectedAgent}...` : "Select an agent to start chatting..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={!selectedAgent}
              className="flex-1"
            />
            
            <Button variant="ghost" size="sm" className="px-2">
              <Smile className="w-4 h-4" />
            </Button>
            
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || !selectedAgent}
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