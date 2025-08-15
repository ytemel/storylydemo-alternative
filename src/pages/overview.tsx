import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { storylyStyles } from "@/lib/storyly-design-system";
import MetricCard from "@/components/metric-card";

import {
  Eye,
  MousePointer,
  ShoppingCart,
  Bot,
  Plus,
  Send,
  MessageCircle,
  X,
  Brain,
} from "lucide-react";
import type { Widget, Recipe } from "@/shared/schema";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Overview() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI assistant for Storyly. I can help you with widget performance, recipe optimization, and analytics insights. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: widgets = [], isLoading: loadingWidgets } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });

  const { data: recipes = [], isLoading: loadingRecipes } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("performance") ||
      lowerMessage.includes("metric")
    ) {
      return "Your widgets are performing well! The summer sale banner has a 4.2% CTR, which is above average. Your recipes are driving good conversion rates. Would you like specific recommendations for optimization?";
    }

    if (lowerMessage.includes("widget") || lowerMessage.includes("create")) {
      return "I can help you create effective widgets! Based on your current performance, I recommend focusing on banner widgets for promotions and story bars for product discovery. What type of content are you planning to promote?";
    }

    if (
      lowerMessage.includes("recipe") ||
      lowerMessage.includes("automation")
    ) {
      return 'Your AI recipes are working great! The "Summer Sale Campaign" has increased conversions by 15%. I suggest creating cross-sell recipes after purchase to boost AOV. Would you like me to guide you through setting up a new recipe?';
    }

    if (lowerMessage.includes("analytics") || lowerMessage.includes("data")) {
      return "Your analytics show strong engagement! Total impressions are up 12.5% and CTR improved by 8.3%. The story bar widgets are performing particularly well. Want me to explain any specific metrics?";
    }

    return "I'm here to help with widgets, recipes, analytics, and performance optimization. You can ask me about creating new content, improving metrics, or understanding your campaign results. What specific area would you like to explore?";
  };

  const metrics = [
    {
      title: "Total Impressions",
      value: "2.4M",
      change: "+12.5%",
      icon: Eye,
      color: "blue",
    },
    {
      title: "Click-through Rate",
      value: "4.2%",
      change: "+8.3%",
      icon: MousePointer,
      color: "green",
    },
    {
      title: "Conversion Rate",
      value: "1.8%",
      change: "+15.2%",
      icon: ShoppingCart,
      color: "yellow",
    },
    {
      title: "Active Recipes",
      value: recipes.filter((r) => r.status === "active").length.toString(),
      change: "AI-Powered",
      icon: Bot,
      color: "purple",
    },
  ];

  const recentWidgets = widgets.slice(0, 2);
  const topRecipes = recipes.slice(0, 2);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className={storylyStyles.header()}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className={storylyStyles.heading(1)}>Overview</h1>
            <p className={storylyStyles.bodyText()}>
              Monitor your widget performance and campaign metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <MetricCard 
                key={metric.title}
                data={{
                  label: metric.title,
                  value: metric.value,
                  change: metric.change,
                  icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">${metric.icon.toString().replace(/.*d="([^"]*)".*/, '<path d="$1" />')}</svg>`,
                  color: metric.color,
                  trend: 'up'
                }}
              />
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={storylyStyles.card()}>
            <h3 className={cn(storylyStyles.heading(3), "mb-4")}>Recent Widgets</h3>
            <div className="space-y-3">
              {loadingWidgets ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">Loading widgets...</div>
                </div>
              ) : recentWidgets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No widgets created yet
                </div>
              ) : (
                recentWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={cn(storylyStyles.bodyText("base"), "font-medium")}>
                        {widget.name}
                      </div>
                      <div className={storylyStyles.captionText()}>
                        Created{" "}
                        {widget.createdAt
                          ? new Date(widget.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </div>
                    </div>
                    <span
                      className={cn(
                        storylyStyles.badge(widget.status === "active" ? "success" : "default")
                      )}
                    >
                      {widget.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={storylyStyles.card()}>
            <h3 className={cn(storylyStyles.heading(3), "mb-4")}>AI Recipe Performance</h3>
            <div className="space-y-3">
              {loadingRecipes ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">Loading recipes...</div>
                </div>
              ) : topRecipes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recipes created yet
                </div>
              ) : (
                topRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={cn(storylyStyles.bodyText("base"), "font-medium")}>
                        {recipe.name}
                      </div>
                      <div className={storylyStyles.captionText()}>
                        {recipe.performance?.conversionRate?.toFixed(1)}%
                        conversion rate
                      </div>
                    </div>
                    <span className="text-success text-sm font-medium">
                      +{Math.floor(Math.random() * 20)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* AI Assistant Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white text-lg">AI Assistant</span>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-50 text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 text-gray-900 p-4 rounded-2xl border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Field */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about widgets, recipes, or analytics..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-sm"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
