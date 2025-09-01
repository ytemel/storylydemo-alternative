import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import WidgetCreator from "@/components/widget-creator";
import { 
  Edit, 
  Settings, 
  BarChart3, 
  Eye,
  Play,
  Pause,
  Archive
} from "lucide-react";
import type { Widget, Placement } from "@/shared/schema";

export default function WidgetDetail() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [showEditor, setShowEditor] = useState(false);
  
  // Extract widget ID from URL
  const widgetId = location.split('/').pop();
  
  const { data: widget, isLoading } = useQuery<Widget>({
    queryKey: ["/api/widgets", widgetId],
    queryFn: () => apiRequest("GET", `/api/widgets/${widgetId}`),
    enabled: !!widgetId,
  });
  
  const { data: placements = [] } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return apiRequest("PUT", `/api/widgets`, { status }, parseInt(widgetId!));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
      toast({
        title: "Widget status updated",
        description: "The widget status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating status",
        description: "There was an error updating the widget status.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-8">
          <div className="animate-pulse">Loading widget...</div>
        </div>
      </div>
    );
  }

  if (!widget) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Widget not found</h3>
          <p className="text-muted-foreground">The widget you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const appliedPlacements = placements.filter(p => 
    p.widgetIds?.includes(widget.id)
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{widget.name}</h1>
              <Badge variant={widget.status === 'active' ? 'default' : 'secondary'}>
                {widget.status}
              </Badge>
            </div>
            <p className="text-muted-foreground capitalize">
              {widget.type.replace('-', ' ')} widget
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                const contentType = widget.type === 'story-bar' ? 'Story Group' : 'Content';
                toast({
                  title: `Create ${contentType}`,
                  description: `${contentType} creation functionality will be implemented here.`,
                });
                // TODO: Implement actual content creation functionality
              }}
            >
              Create {widget.type === 'story-bar' ? 'Story Group' : 'Content'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowEditor(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant={widget.status === 'active' ? 'destructive' : 'default'}
              onClick={() => updateStatusMutation.mutate(widget.status === 'active' ? 'paused' : 'active')}
            >
              {widget.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Widget Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <Eye className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Widget preview will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Widget Stats & Settings */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Impressions</span>
                  <span className="font-medium">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Clicks</span>
                  <span className="font-medium">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">CTR</span>
                  <span className="font-medium">--%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Conversions</span>
                  <span className="font-medium">--</span>
                </div>
              </CardContent>
            </Card>

            {/* Placements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Placements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appliedPlacements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Not applied to any placements</p>
                ) : (
                  <div className="space-y-2">
                    {appliedPlacements.map((placement) => (
                      <div key={placement.id} className="text-sm">
                        {placement.name}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Widget Info */}
            <Card>
              <CardHeader>
                <CardTitle>Widget Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Created</span>
                  <p className="font-medium">
                    {widget.createdAt ? new Date(widget.createdAt as any).toLocaleDateString() : '--'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Last updated</span>
                  <p className="font-medium">
                    {widget.updatedAt ? new Date(widget.updatedAt as any).toLocaleDateString() : '--'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Type</span>
                  <p className="font-medium capitalize">{widget.type.replace('-', ' ')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <WidgetCreator
        open={showEditor}
        onOpenChange={setShowEditor}
        widget={widget}
      />
    </div>
  );
}