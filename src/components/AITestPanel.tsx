import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
//import { Loader2 } from "lucide-react";
import { errorToast } from "@/lib/utils";
//import * as apiService from "@/services/apiService"; // Adjust if named export
//import { sendAIMessage } from "@/services/apiService"; // Named import if not default
import { Bot, Send, CheckCircle, XCircle, Loader2, TestTube } from 'lucide-react';
import { apiService } from '@/services/apiService';
import OpenAI from "openai";

const AITestPanel = () => {
  const [testMessage, setTestMessage] = useState('');
  const [testAgentId, setTestAgentId] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('current');
  const [grokKey, setGrokKey] = useState('');
  const [lastTestStatus, setLastTestStatus] = useState<'success' | 'error' | null>(null);

const handleTestAI = async () => {

const client = new OpenAI({
    apiKey: "",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000,  // Override default timeout with longer timeout for reasoning models
    dangerouslyAllowBrowser: true
});

const completion = await client.chat.completions.create({
    model: "grok-2-1212",
    messages: [
        {
            role: 'system' ,
            content:
               testMessage
        },

    ],
});
setLastTestStatus('success');
setResponse(completion.choices[0].message.content);
console.log(completion.choices[0].message.content);
  };

  return (
    
    <div className="space-y-4">
    <Badge variant={
      lastTestStatus === 'success'
        ? 'default'
        : lastTestStatus === 'error'
        ? 'destructive'
        : 'outline'
    }>
      {loading ? (
        <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Testing...</>
      ) : lastTestStatus === 'success' ? (
        <><CheckCircle className="w-3 h-3 mr-1" /> Working</>
      ) : lastTestStatus === 'error' ? (
        <><XCircle className="w-3 h-3 mr-1" /> Failed</>
      ) : (
        <>Idle</>
      )}
    </Badge>

      
      <Input
        placeholder="Enter test message"
        value={testMessage}
        onChange={(e) => setTestMessage(e.target.value)}
      />
               
            <Label htmlFor="test-agent">Agent ID (Optional)</Label>
            <Input
              id="test-agent"
              value={testAgentId}
              onChange={(e) => setTestAgentId(e.target.value)}
              placeholder="Leave empty for general test"
            />

      <Button onClick={handleTestAI} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Test AI
      </Button>
      {response && (
        <Textarea readOnly value={response} rows={10} />
      )}
    </div>
  );
};

export default AITestPanel;