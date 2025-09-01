import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import WidgetCreator from "@/components/widget-creator";
import { Plus, Edit, Trash2, Image, Video, BarChart3, Search, MoreVertical } from "lucide-react";
import { WIDGET_DEFINITIONS } from "@/lib/widget-definitions";
import type { Widget } from "@/shared/schema";
import WidgetDetailsDrawer from "@/components/widget-details-drawer";

const widgetTypes = WIDGET_DEFINITIONS;

// Widget type definitions for widget only widgets
const WIDGET_ONLY_TYPES = [
  {
    id: 'story-bar',
    name: 'Story bar',
    description: 'Instagram-style stories for your website',
    icon: Video,
    preview: '/story-bar-preview.png'
  },
  {
    id: 'video-feed', 
    name: 'Video feed',
    description: 'Showcase videos in grid or carousel format',
    icon: Video,
    preview: '/video-feed-preview.png'
  },
  {
    id: 'banner',
    name: 'Banner',
    description: 'Promotional banners with images and text',
    icon: Image,
    preview: '/banner-preview.png'
  },
  {
    id: 'swipe-card',
    name: 'Swipe Card', 
    description: 'Interactive swipeable product cards',
    icon: Image,
    preview: '/swipe-card-preview.png'
  },
  {
    id: 'canvas',
    name: 'Canvas',
    description: 'Flexible content canvas widget',
    icon: Image,
    preview: '/canvas-preview.png'
  },
  {
    id: 'quiz',
    name: 'Quiz',
    description: 'Interactive quizzes and polls',
    icon: Image,
    preview: '/quiz-preview.png'
  },
  {
    id: 'countdown',
    name: 'Countdown',
    description: 'Urgency-driving countdown timers',
    icon: Image,
    preview: '/countdown-preview.png'
  }
];

export default function Widgets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | undefined>();
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [usageFilter, setUsageFilter] = useState<string | undefined>(undefined);
  const [location, setLocation] = useLocation();

  const { data: widgets = [], isLoading } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });
  
  // Filter by type and usage if selected
  const filteredWidgets = widgets.filter(widget => {
    // Type filter
    const typeMatch = !typeFilter || typeFilter === 'all' ? true : widget.type === typeFilter;
    
    // Usage filter
    let usageMatch = true;
    if (usageFilter === 'standalone') {
      usageMatch = !(widget as any).isRecipeWidget;
    } else if (usageFilter === 'recipe') {
      usageMatch = !!(widget as any).isRecipeWidget;
    }
    // If usageFilter is undefined or 'all', usageMatch remains true
    
    return typeMatch && usageMatch;
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
        description:
          "There was an error deleting the widget. Please try again.",
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

  const handleCloseCreator = () => {
    setShowCreator(false);
    setSelectedWidget(undefined);
  };

  const handleWidgetTypeClick = (typeId: string) => {
    setSelectedType(typeId);
    setShowCreator(true);
  };
  
  const handleCreateNew = () => {
    setSelectedType(undefined);
    setShowCreator(true);
  };


  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Widget Library</h1>
            <p className="text-muted-foreground">Create and manage both widget only widgets and recipe widgets</p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create new
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Widget Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {WIDGET_ONLY_TYPES.map((widgetType) => {
            const Icon = widgetType.icon;
            return (
              <Card
                key={widgetType.id}
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => handleWidgetTypeClick(widgetType.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{widgetType.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{widgetType.description}</p>
                  {/* Preview placeholder */}
                  <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Your Widgets Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your widgets</h2>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {WIDGET_ONLY_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id} className="capitalize">
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading widgets...</div>
            </div>
          ) : filteredWidgets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No widgets created yet</h3>
              <p className="text-muted-foreground mb-6">Create your first widget to get started with widget only widgets or recipe widgets.</p>
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Widget
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWidgets.map((widget) => {
                const isRecipeWidget = (widget as any).isRecipeWidget;
                return (
                  <Card 
                    key={widget.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      isRecipeWidget ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-blue-500'
                    }`}
                  >
                    <CardContent className="p-4">
                      {/* Widget Preview */}
                      <div className="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center relative">
                        <Video className="w-8 h-8 text-gray-400" />
                        {/* Widget Type Indicator */}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                          isRecipeWidget 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {isRecipeWidget ? 'Recipe' : 'Widget Only'}
                        </div>
                      </div>
                      
                      {/* Widget Info */}
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate">{widget.name}</h3>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {widget.type.replace('-', ' ')}
                          </Badge>
                        </div>
                        {/* Assignment Info */}
                        <div className="text-xs text-muted-foreground">
                          {isRecipeWidget ? (
                            widget.parentRecipeId ? (
                              <span className="text-green-600">📝 Assigned to Recipe</span>
                            ) : (
                              <span className="text-amber-600">⚠️ Not assigned to recipe</span>
                            )
                          ) : (
                            widget.placementId ? (
                              <span className="text-green-600">📍 Assigned to Placement</span>
                            ) : (
                              <span className="text-amber-600">⚠️ Not assigned to placement</span>
                            )
                          )}
                        </div>
                      </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWidget(widget);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to individual widget page
                          setLocation(`/dashboard/widgets/${widget.id}`);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <WidgetCreator
        open={showCreator}
        onOpenChange={() => {
          setShowCreator(false);
          setSelectedWidget(undefined);
          setSelectedType(undefined);
        }}
        widget={selectedWidget}
        selectedType={selectedType}
      />
      {/* Add a right-hand drawer/modal for widget details (theme, settings, delete) */}
      {selectedWidget && (
        <WidgetDetailsDrawer
          widget={selectedWidget}
          open={!!selectedWidget}
          onClose={handleCloseCreator}
          onDelete={handleDeleteWidget}
        />
      )}
    </div>
  );
}
