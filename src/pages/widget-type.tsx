import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import WidgetCreator from "@/components/widget-creator";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MoreVertical,
  Video,
  Image,
  BarChart3,
  Grid3X3
} from "lucide-react";
import type { Widget } from "@/shared/schema";

export default function WidgetType() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [usageFilter, setUsageFilter] = useState<string | undefined>(undefined);
  
  // Extract widget type from URL (e.g., /dashboard/widgets/type/video-feed)
  const widgetType = location.split('/').pop();
  
  const { data: widgets = [], isLoading } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });
  
  // Debug logging
  console.log('Current location:', location);
  console.log('Extracted widgetType:', widgetType);
  console.log('Available widgets:', widgets.map(w => ({ id: w.id, name: w.name, type: w.type })));
  
  // Filter widgets by type (both widget only and recipe widgets)
  const typeWidgets = widgets.filter(widget => 
    widget.type === widgetType && 
    widget.status !== 'archived'
  );
  
  console.log('Filtered typeWidgets:', typeWidgets.map(w => ({ id: w.id, name: w.name, type: w.type })));
  
  // Filter by search query and usage type
  const filteredWidgets = typeWidgets.filter(widget => {
    const searchMatch = widget.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Usage filter
    let usageMatch = true;
    if (usageFilter === 'standalone') {
      usageMatch = !(widget as any).isRecipeWidget;
    } else if (usageFilter === 'recipe') {
      usageMatch = !!(widget as any).isRecipeWidget;
    }
    // If usageFilter is undefined or 'all', usageMatch remains true
    
    return searchMatch && usageMatch;
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/widgets`, undefined, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
      toast({
        title: "Widget deleted",
        description: "The widget has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error deleting widget",
        description: "There was an error deleting the widget. Please try again.",
        variant: "destructive",
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PUT", "/api/widgets", { status: "archived" }, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
      toast({ title: "Widget archived", description: "The widget was archived." });
    },
    onError: () => {
      toast({ title: "Error archiving widget", description: "Please try again.", variant: "destructive" });
    },
  });

  const handleEditWidget = (widget: Widget) => {
    setSelectedWidget(widget);
    setShowCreator(true);
  };

  const handleDeleteWidget = (id: number) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateNew = () => {
    setSelectedWidget(undefined);
    setShowCreator(true);
  };

  const handleCloseCreator = () => {
    setShowCreator(false);
    setSelectedWidget(undefined);
  };

  // Get widget type info
  const getWidgetTypeInfo = (type: string) => {
    const typeMap = {
      'story-bar': { name: 'Story Bar', icon: Video, description: 'Instagram-style stories for your website' },
      'video-feed': { name: 'Video Feed', icon: Video, description: 'Showcase videos in grid or carousel format' },
      'banner': { name: 'Banner', icon: Image, description: 'Promotional banners with images and text' },
      'swipe-card': { name: 'Swipe Card', icon: Grid3X3, description: 'Interactive swipeable product cards' },
      'canvas': { name: 'Canvas', icon: Grid3X3, description: 'Flexible content canvas widget' },
      'quiz': { name: 'Quiz', icon: Grid3X3, description: 'Interactive quizzes and polls' },
      'countdown': { name: 'Countdown', icon: Grid3X3, description: 'Urgency-driving countdown timers' }
    };
    return typeMap[type as keyof typeof typeMap] || { name: type, icon: Grid3X3, description: 'Widget type' };
  };

  const typeInfo = getWidgetTypeInfo(widgetType || '');
  const Icon = typeInfo.icon;

  // Special layout for swipe cards to match the design reference
  if (widgetType === 'swipe-card') {
    return (
      <div className="animate-fade-in">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Swipe Card</h1>
                <p className="text-muted-foreground">Interactive swipeable product cards</p>
              </div>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create new
            </Button>
          </div>
        </header>

        <div className="p-6">
              {/* Top section with tabs and filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Content
                  </h2>
                  <div className="flex items-center gap-4">
                    <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                      <option>New bar widget</option>
                    </select>
                    <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                      <option>Labels</option>
                    </select>
                    <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                      <option>Audiences</option>
                    </select>
                  </div>
                </div>
                <div className="w-6 h-6">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Status tabs */}
              <div className="flex gap-1 mb-6 border-b border-gray-200">
                <button className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
                  All ({filteredWidgets.length})
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  Active ({filteredWidgets.filter(w => w.status === 'active').length})
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  Inactive ({filteredWidgets.filter(w => w.status === 'inactive').length})
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                  Archived ({filteredWidgets.filter(w => w.status === 'archived').length})
                </button>
              </div>

          {/* Content list */}
          <div className="space-y-4">
            {filteredWidgets.map((widget) => {
              const isRecipeWidget = (widget as any).isRecipeWidget;
              const content = widget.content as any;
              const isActive = widget.status === 'active';
              const isScheduled = widget.status === 'scheduled';
              const isInactive = widget.status === 'inactive';
              
              return (
                <div key={widget.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Status indicator */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          isActive ? 'bg-green-500' :
                          isScheduled ? 'bg-blue-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm font-medium text-gray-900">{widget.name}</span>
                      </div>

                      {/* Widget type badge */}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${isRecipeWidget ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                      >
                        {isRecipeWidget ? 'Recipe' : 'Widget Only'}
                      </Badge>

                      {/* Status badge */}
                      <Badge variant={isActive ? 'default' : isScheduled ? 'secondary' : 'outline'} className="text-xs">
                        {isActive ? 'Active' : isScheduled ? 'Scheduled' : 'Inactive'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Content details */}
                  <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
                    {/* Timing */}
                    <div className="flex items-center gap-1">
                      <span>{isActive ? 'Live now' : isScheduled ? 'Scheduled for' : 'Inactive'}</span>
                      {isScheduled && (
                        <span>
                          {widget.scheduledAt ? new Date(widget.scheduledAt as any).toLocaleDateString() : 'Soon'}
                        </span>
                      )}
                      {content.description && content.description.includes('Ends') && (
                        <span> - {content.description}</span>
                      )}
                    </div>

                    {/* Collection */}
                    {content.collection && (
                      <div className="flex items-center gap-1">
                        <span>🔗</span>
                        <span>{content.collection}</span>
                      </div>
                    )}

                    {/* Audience */}
                    {content.audience && (
                      <div className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{content.audience}</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail images */}
                  {content.slides && (
                    <div className="mt-3 flex gap-2">
                      {content.slides.slice(0, 4).map((slide: string, index: number) => (
                        <div key={index} className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                      ))}
                      {content.slides.length > 4 && (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
                          +{content.slides.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <WidgetCreator
          open={showCreator}
          onOpenChange={handleCloseCreator}
          widget={selectedWidget}
          selectedType={widgetType}
        />
      </div>
    );
  }

  // Special layout for banner widgets to match the design reference
  if (widgetType === 'banner') {
    return (
      <div className="animate-fade-in">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Banner</h1>
                <p className="text-muted-foreground">Promotional banners with images and text</p>
              </div>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create new
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Top section with filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Image className="w-5 h-5" />
                Content
              </h2>
              <div className="flex items-center gap-4">
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Banner ytyt</option>
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Labels</option>
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Audiences</option>
                </select>
              </div>
            </div>
            <div className="w-6 h-6">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
              All ({filteredWidgets.length})
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Active ({filteredWidgets.filter(w => w.status === 'active').length})
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Inactive (0)
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Test (0)
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Archived ({filteredWidgets.filter(w => w.status === 'archived').length})
            </button>
          </div>

          {/* Table-based layout matching the design reference */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Slide</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Audience</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWidgets.map((widget) => {
                  const isRecipeWidget = (widget as any).isRecipeWidget;
                  const content = widget.content as any;
                  const isActive = widget.status === 'active';
                  
                  return (
                    <tr key={widget.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          {/* Selection checkbox */}
                          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                          </div>
                          
                          {/* Thumbnail */}
                          <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <Image className="w-6 h-6 text-gray-400" />
                          </div>
                          
                          {/* Widget info */}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{widget.name}</span>
                            {/* Widget type badge */}
                            <Badge 
                              variant="outline" 
                              className={`text-xs mt-1 w-fit ${isRecipeWidget ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                            >
                              {isRecipeWidget ? 'Recipe' : 'Widget Only'}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {/* Status toggle switch */}
                          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isActive ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isActive ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </div>
                          
                          {/* Calendar icon */}
                          <div className="w-5 h-5 text-gray-400">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {content.audience || 'None'}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <WidgetCreator
          open={showCreator}
          onOpenChange={handleCloseCreator}
          widget={selectedWidget}
          selectedType={widgetType}
        />
      </div>
    );
  }

  // Special layout for story bar widgets to match the design reference
  if (widgetType === 'story-bar') {
    return (
      <div className="animate-fade-in">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Story Bar</h1>
                <p className="text-muted-foreground">Instagram-style stories for your website</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Top section with filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Content
              </h2>
              <div className="flex items-center gap-4">
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Story Bar yt -test</option>
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Labels</option>
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Audiences</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              {/* Grid/List view toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button className="p-1.5 bg-white rounded-md shadow-sm">
                  <Grid3X3 className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1.5 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
              All ({filteredWidgets.length})
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Active ({filteredWidgets.filter(w => w.status === 'active').length})
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Inactive (0)
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Test (0)
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Archived ({filteredWidgets.filter(w => w.status === 'archived').length})
            </button>
          </div>

          {/* Card-based layout matching the design reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWidgets.map((widget) => {
              const isRecipeWidget = (widget as any).isRecipeWidget;
              const content = widget.content as any;
              const isActive = widget.status === 'active';
              const hasPersonalization = content.hasPersonalization || false;
              
              return (
                <div key={widget.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Selection checkbox */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Story thumbnail */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      {/* Circular story preview */}
                      <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center overflow-hidden">
                        {widget.name === "Personalization" ? (
                          <div className="text-2xl">📊</div>
                        ) : (
                          <Image className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Widget name and type */}
                  <div className="text-center mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">{widget.name}</h3>
                    {/* Widget type badge */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${isRecipeWidget ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                    >
                      {isRecipeWidget ? 'Recipe' : 'Widget Only'}
                    </Badge>
                  </div>

                  {/* Personalization toggle */}
                  <div className="flex justify-center mb-4">
                    <div className="text-sm text-gray-600 mb-2">Personalization</div>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      hasPersonalization ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        hasPersonalization ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </div>
                  </div>

                  {/* Analytics bars (simplified representation) */}
                  <div className="flex justify-center gap-1 mb-4">
                    <div className="w-3 h-8 bg-green-500 rounded-sm"></div>
                    <div className="w-3 h-6 bg-orange-400 rounded-sm"></div>
                    <div className="w-3 h-4 bg-gray-300 rounded-sm"></div>
                  </div>

                  {/* Audience information */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                      <div className="w-4 h-4 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span>{content.audience || 'Audience'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <WidgetCreator
          open={showCreator}
          onOpenChange={handleCloseCreator}
          widget={selectedWidget}
          selectedType={widgetType}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{typeInfo.name}</h1>
              <p className="text-muted-foreground">{typeInfo.description}</p>
            </div>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create {typeInfo.name}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Create Content Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                Create {widgetType === 'story-bar' ? 'Story Group' : 'Content'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {widgetType === 'story-bar' 
                  ? 'Create story groups to organize your content and manage stories across multiple widgets.'
                  : 'Create content that can be used across multiple widgets of this type.'
                }
              </p>
              <Button onClick={() => {
                const contentType = widgetType === 'story-bar' ? 'Story Group' : 'Content';
                toast({
                  title: `Create ${contentType}`,
                  description: `${contentType} creation functionality will be implemented here.`,
                });
                // TODO: Implement actual content creation functionality
                // This could navigate to a content creation page or open a modal
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Create {widgetType === 'story-bar' ? 'Story Group' : 'Content'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Your {typeInfo.name} Widgets ({filteredWidgets.length})
          </h2>
          <div className="flex gap-3">
            <Select value={usageFilter} onValueChange={setUsageFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All widgets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All widgets</SelectItem>
                <SelectItem value="standalone">Widget Only</SelectItem>
                <SelectItem value="recipe">Recipe widgets</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={`Search ${typeInfo.name.toLowerCase()} widgets...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">Loading {typeInfo.name.toLowerCase()} widgets...</div>
          </div>
        ) : filteredWidgets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {typeInfo.name.toLowerCase()} widgets yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first {typeInfo.name.toLowerCase()} widget to get started.
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create {typeInfo.name}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Last updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWidgets.map((widget) => {
                    const isRecipeWidget = (widget as any).isRecipeWidget;
                    return (
                      <TableRow key={widget.id}>
                        <TableCell className="font-medium">{widget.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={isRecipeWidget ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}
                          >
                            {isRecipeWidget ? 'Recipe' : 'Widget Only'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={widget.status === 'active' ? 'default' : 'secondary'}>
                            {widget.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {isRecipeWidget ? (
                              widget.parentRecipeId ? '✓ Assigned to Recipe' : '⚠ Not assigned to recipe'
                            ) : (
                              widget.placementId ? '✓ Assigned to Placement' : '⚠ Not assigned to placement'
                            )}
                          </span>
                        </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>CTR: --</div>
                          <div className="text-muted-foreground">Clicks: --</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {widget.updatedAt ? new Date(widget.updatedAt as any).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditWidget(widget)}>
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setLocation(`/dashboard/widgets/${widget.id}`)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <WidgetCreator
        open={showCreator}
        onOpenChange={handleCloseCreator}
        widget={selectedWidget}
        selectedType={widgetType}
      />
    </div>
  );
}