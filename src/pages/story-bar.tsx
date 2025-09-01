import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import WidgetCreator from "@/components/widget-creator";
import { Plus, Edit, Trash2, Video, Search, MoreVertical } from "lucide-react";
import type { Widget } from "@/shared/schema";

export default function StoryBar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: widgets = [], isLoading } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });

  // Filter only story-bar widgets
  const storyBarWidgets = widgets.filter(widget => widget.type === 'story-bar');

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/widgets`, undefined, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
      toast({
        title: "Story Bar widget deleted",
        description: "The story bar widget has been successfully deleted.",
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
    if (confirm("Are you sure you want to delete this story bar widget?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseCreator = () => {
    setShowCreator(false);
    setSelectedWidget(undefined);
  };

  // Helper function to determine widget type
  const getWidgetType = (widget: Widget) => {
    // If widget has parentRecipeId, it's definitely a recipe widget
    if (widget.parentRecipeId) {
      return "Recipe";
    }
    
    // If widget has isRecipeWidget flag set to true, it's a recipe widget
    if ((widget as any).isRecipeWidget === true) {
      return "Recipe";
    }
    
    // Otherwise it's widget only (either explicitly set as false or has placementId)
    return "Widget Only";
  };

  // Filter widgets based on search query and status
  const filteredWidgets = storyBarWidgets
    .filter((widget) =>
      widget.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((w) => (statusFilter ? (w.status || "").toLowerCase() === statusFilter : true));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Story Bar</h1>
            <p className="text-muted-foreground">Manage your story bar widgets</p>
          </div>
          <Button onClick={() => setShowCreator(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Story Bar
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Filter Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-xl font-semibold text-foreground">Your Story Bar Widgets</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search story bar widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setShowCreator(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Story Bar
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading story bar widgets...</div>
            </div>
          ) : filteredWidgets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No story bar widgets yet</h3>
                <p className="text-gray-500 mb-6">Create your first story bar widget to get started.</p>
                <Button onClick={() => setShowCreator(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Story Bar Widget
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
                      <TableHead>Last updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWidgets.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="font-medium">{w.name}</TableCell>
                        <TableCell>
                          <Badge variant={getWidgetType(w) === 'Recipe' ? 'default' : 'outline'}>
                            {getWidgetType(w)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={w.status === 'active' ? 'default' : 'secondary'}>
                            {w.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{w.updatedAt ? new Date(w.updatedAt as any).toLocaleString() : "—"}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditWidget(w)}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => archiveMutation.mutate(w.id)}>Archive</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteWidget(w.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <WidgetCreator
        open={showCreator}
        onOpenChange={() => {
          setShowCreator(false);
          setSelectedWidget(undefined);
        }}
        widget={selectedWidget}
      />
    </div>
  );
}