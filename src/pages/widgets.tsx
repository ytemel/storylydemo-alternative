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

export default function Widgets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | undefined>();
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [parentRecipeFilter, setParentRecipeFilter] = useState<string | undefined>(undefined);
  const [location, setLocation] = useLocation();

  const { data: widgets = [], isLoading } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });

  console.log("Widgets page - fetched widgets:", widgets);
  console.log("Widgets page - isLoading:", isLoading);

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
    // Prevent creation from standalone Widgets page
    return;
  };

  // Filter widgets based on search query
  useEffect(() => {
    if (location?.includes("type=") || location?.includes("create")) {
      toast({ title: "Create widgets inside a Recipe.", description: "Redirected to Recipes", variant: "destructive" });
      setLocation("/dashboard/recipes");
    }
  }, [location]);
  const filteredWidgets = widgets
    .filter((widget) =>
      widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((w) => (typeFilter ? w.type === typeFilter : true))
    .filter((w) => (statusFilter ? (w.status || "").toLowerCase() === statusFilter : true))
    .filter((w) => (parentRecipeFilter ? String(w.parentRecipeId || "") === parentRecipeFilter : true));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Widgets</h1>
            <p className="text-muted-foreground">Only edit widgets created inside Recipes. Story is managed separately.</p>
          </div>
          {/* No global Create button */}
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Type previews removed to enforce creation inside Recipes */}

        {/* Your Widgets Section (Table) */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-xl font-semibold text-foreground">Your widgets</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(["banner","story-bar","video-feed","carousel","swipe-card", ...widgets.map(w=>w.type)])).map((t)=> (
                    <SelectItem key={t} value={t} className="capitalize">{t.replace("-"," ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="detached">Detached</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Parent Recipe ID"
                value={parentRecipeFilter || ""}
                onChange={(e) => setParentRecipeFilter(e.target.value || undefined)}
                className="w-[180px]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading widgets...</div>
            </div>
          ) : filteredWidgets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets available</h3>
                <p className="text-gray-500 mb-6">Create widgets inside a Recipe.</p>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Parent Recipe</TableHead>
                      <TableHead>Last updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWidgets.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="font-medium">{w.name}</TableCell>
                        <TableCell className="capitalize">{w.type.replace("-", " ")}</TableCell>
                        <TableCell className="capitalize">{w.status}</TableCell>
                        <TableCell>{w.parentRecipeId ? `#${w.parentRecipeId}` : "—"}</TableCell>
                        <TableCell>{w.updatedAt ? new Date(w.updatedAt as any).toLocaleString() : "—"}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditWidget(w)}>Edit</Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation("/dashboard/recipes" + (w.parentRecipeId ? `?recipeId=${w.parentRecipeId}` : ""))}
                          >
                            View in Recipe
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => archiveMutation.mutate(w.id)}>Archive</Button>
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
          setSelectedType(undefined);
        }}
        widget={selectedWidget}
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
