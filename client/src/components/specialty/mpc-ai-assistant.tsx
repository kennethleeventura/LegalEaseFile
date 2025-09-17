import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Bot, Send, Mic, MicOff, Volume2, VolumeX, Download, Copy, Trash2, Star, MessageCircle, Brain, Lightbulb, FileText, Search, Settings } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    caseId?: string;
    documentId?: string;
    citationId?: string;
  };
  attachments?: {
    type: 'document' | 'image' | 'audio';
    name: string;
    url: string;
  }[];
  feedback?: 'helpful' | 'not-helpful';
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  category: 'research' | 'drafting' | 'analysis' | 'strategy' | 'compliance';
  enabled: boolean;
  confidence: number;
  usage: number;
}

interface ConversationThread {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  lastActivity: string;
  category: string;
  starred: boolean;
}

export default function MPCAIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [activeThread, setActiveThread] = useState<string>('');
  const [capabilities, setCapabilities] = useState<AICapability[]>([]);
  const [selectedMode, setSelectedMode] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiModes = [
    { value: 'general', label: 'General Legal Assistant', icon: <Bot className="h-4 w-4" /> },
    { value: 'research', label: 'Legal Research', icon: <Search className="h-4 w-4" /> },
    { value: 'drafting', label: 'Document Drafting', icon: <FileText className="h-4 w-4" /> },
    { value: 'analysis', label: 'Case Analysis', icon: <Brain className="h-4 w-4" /> },
    { value: 'strategy', label: 'Legal Strategy', icon: <Lightbulb className="h-4 w-4" /> }
  ];

  const quickPrompts = [
    "Summarize the key legal issues in this case",
    "Draft a motion to dismiss for lack of jurisdiction",
    "Research recent precedents on contract interpretation",
    "Analyze the strengths and weaknesses of this argument",
    "Suggest litigation strategy for this dispute",
    "Review this document for compliance issues"
  ];

  useEffect(() => {
    fetchConversationThreads();
    fetchAICapabilities();
    initializeDefaultThread();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversationThreads = async () => {
    try {
      const response = await fetch('/api/ai/conversations');
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error('Error fetching conversation threads:', error);
    }
  };

  const fetchAICapabilities = async () => {
    try {
      const response = await fetch('/api/ai/capabilities');
      const data = await response.json();
      setCapabilities(data);
    } catch (error) {
      console.error('Error fetching AI capabilities:', error);
    }
  };

  const initializeDefaultThread = () => {
    const defaultMessages: ChatMessage[] = [
      {
        id: '1',
        role: 'assistant',
        content: `Hello! I'm MPC, your AI legal assistant powered by advanced natural language processing. I'm here to help you with:

• **Legal Research** - Find relevant cases, statutes, and regulations
• **Document Drafting** - Generate legal documents and correspondence
• **Case Analysis** - Analyze legal issues and potential outcomes
• **Strategic Planning** - Develop litigation and negotiation strategies
• **Compliance Review** - Check documents for regulatory compliance

How can I assist you with your legal work today?`,
        timestamp: new Date().toISOString()
      }
    ];
    setMessages(defaultMessages);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          mode: selectedMode,
          context: { threadId: activeThread }
        })
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        context: data.context
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.start();
    }
  };

  const speakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const provideFeedback = async (messageId: string, feedback: 'helpful' | 'not-helpful') => {
    try {
      await fetch(`/api/ai/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, feedback })
      });

      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      ));
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const newConversation = () => {
    setMessages([]);
    setActiveThread('');
    initializeDefaultThread();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">MPC AI Assistant</h2>
          <p className="text-gray-600">Advanced AI-powered legal research and drafting assistant</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={newConversation}>
            <MessageCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
            <Settings className="mr-2 h-4 w-4" />
            Configure AI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{threads.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                <p className="text-2xl font-bold text-gray-900">247hrs</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conversation History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b ${
                      activeThread === thread.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setActiveThread(thread.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {thread.title}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">{thread.preview}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {thread.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {thread.messageCount} msgs
                          </span>
                        </div>
                      </div>
                      {thread.starred && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">MPC AI Assistant</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-600">Online</span>
                  </div>
                </div>
                <Select value={selectedMode} onValueChange={setSelectedMode}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModes.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>
                        <div className="flex items-center gap-2">
                          {mode.icon}
                          {mode.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-6 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => speakMessage(message.content)}
                            className="h-6 px-2"
                          >
                            {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                          </Button>
                          <div className="flex gap-1 ml-auto">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => provideFeedback(message.id, 'helpful')}
                              className={`h-6 px-2 ${message.feedback === 'helpful' ? 'text-green-600' : ''}`}
                            >
                              👍
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => provideFeedback(message.id, 'not-helpful')}
                              className={`h-6 px-2 ${message.feedback === 'not-helpful' ? 'text-red-600' : ''}`}
                            >
                              👎
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                        <span className="text-sm text-gray-600">MPC is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-4 space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {quickPrompts.slice(0, 3).map((prompt, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => setInput(prompt)}
                      className="text-xs"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask MPC anything about legal research, document drafting, case analysis..."
                      className="min-h-12 pr-20 resize-none"
                      disabled={isLoading}
                    />
                    <div className="absolute right-2 top-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={isListening ? undefined : startVoiceInput}
                        className={`h-8 w-8 p-0 ${isListening ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="h-8 w-8 p-0 bg-purple-500 hover:bg-purple-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="capabilities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="capabilities">AI Capabilities</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="capabilities">
          <Card>
            <CardHeader>
              <CardTitle>AI Capabilities & Performance</CardTitle>
              <CardDescription>Monitor and configure MPC's specialized legal AI functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capabilities.map((capability) => (
                  <Card key={capability.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{capability.name}</h4>
                        <p className="text-sm text-gray-600">{capability.description}</p>
                      </div>
                      <Badge variant={capability.enabled ? 'default' : 'secondary'}>
                        {capability.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Confidence Level</span>
                        <span>{capability.confidence}%</span>
                      </div>
                      <Progress value={capability.confidence} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Usage Count</span>
                        <span>{capability.usage.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Settings</CardTitle>
              <CardDescription>Customize MPC's behavior and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Response Style</Label>
                    <Select defaultValue="professional">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise & Direct</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="detailed">Detailed & Thorough</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Citation Style</Label>
                    <Select defaultValue="bluebook">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bluebook">Bluebook</SelectItem>
                        <SelectItem value="alwd">ALWD</SelectItem>
                        <SelectItem value="chicago">Chicago</SelectItem>
                        <SelectItem value="mla">MLA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Jurisdiction Focus</Label>
                    <Select defaultValue="federal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="federal">Federal</SelectItem>
                        <SelectItem value="california">California</SelectItem>
                        <SelectItem value="newyork">New York</SelectItem>
                        <SelectItem value="texas">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Confidence Threshold</Label>
                    <Input type="number" min="0" max="100" defaultValue="80" />
                    <p className="text-xs text-gray-600 mt-1">
                      Minimum confidence level for AI responses
                    </p>
                  </div>
                  <div>
                    <Label>Maximum Response Length</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (500 words)</SelectItem>
                        <SelectItem value="medium">Medium (1000 words)</SelectItem>
                        <SelectItem value="long">Long (2000 words)</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Voice Settings</Label>
                    <Select defaultValue="female">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female Voice</SelectItem>
                        <SelectItem value="male">Male Voice</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Track your AI assistant usage and productivity gains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Total Interactions</h4>
                  <p className="text-2xl font-bold text-purple-900">2,847</p>
                  <p className="text-sm text-purple-700">This month</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Time Saved</h4>
                  <p className="text-2xl font-bold text-blue-900">247 hrs</p>
                  <p className="text-sm text-blue-700">Estimated total</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Accuracy Rate</h4>
                  <p className="text-2xl font-bold text-green-900">94.3%</p>
                  <p className="text-sm text-green-700">User satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}