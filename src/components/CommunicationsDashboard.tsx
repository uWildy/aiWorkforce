import { useState } from "react";
import { ContactsList } from "./ContactsList";
import { EnhancedChatInterface } from "./EnhancedChatInterface";

export function CommunicationsDashboard() {
  const [selectedContact, setSelectedContact] = useState<{ 
    type: 'organization' | 'agent'; 
    id: string; 
    name: string 
  }>();

  const handleSendMessage = async (message: string, recipient: string) => {
    try {
      // Integration with backend API would go here
      console.log('Sending message:', message, 'to:', recipient);
      // await apiService.sendMessage({ content: message, recipient });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Contacts/Channels List */}
      <div className="lg:col-span-1">
        <ContactsList 
          onSelectContact={setSelectedContact}
          selectedContact={selectedContact}
        />
      </div>
      
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <EnhancedChatInterface 
          selectedContact={selectedContact}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}