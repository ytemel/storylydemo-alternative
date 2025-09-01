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
      />
    </div>
  );
}