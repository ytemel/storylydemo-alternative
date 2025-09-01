import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MoreVertical,
  ChevronRight,
  Settings2,
} from "lucide-react";
import type { Recipe } from "@/shared/schema";

export default function Recipes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [placementFilter, setPlacementFilter] = useState<string | undefined>(undefined);
  const [labelsFilter, setLabelsFilter] = useState<string | undefined>(undefined);
  const [audiencesFilter, setAudiencesFilter] = useState<string | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/recipes`, undefined, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted.",
      });
    },
    onError: () => {
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
      toast({
        title: "Error deleting campaign",
        description: "There was an error deleting the campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", "/api/recipes", { status }, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      toast({
        title: "Campaign status updated",
        description: "The campaign status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating status",
        description: "There was an error updating the campaign status.",
        variant: "destructive",
      });
    },
  });


  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    toggleStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recipeToDelete) {
      deleteMutation.mutate(recipeToDelete.id);
    }
  };

  // Filter recipes based on search query and filters
  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((recipe) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return recipe.status === "active";
      if (statusFilter === "inactive") return recipe.status === "paused" || recipe.status === "draft";
      if (statusFilter === "archived") return recipe.status === "archived";
      return true;
    });

  const getStatusCounts = () => {
    const active = recipes.filter(r => r.status === "active").length;
    const inactive = recipes.filter(r => r.status === "paused" || r.status === "draft").length;
    const archived = recipes.filter(r => r.status === "archived").length;
    return { all: recipes.length, active, inactive, archived };
  };

  const statusCounts = getStatusCounts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "draft":
        return "bg-gray-500";
      case "archived":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  const getWidgetsList = (recipe: Recipe) => {
    // Extract widget types from workflow or other recipe data
    if (recipe.workflow?.steps) {
      const widgetTypes = recipe.workflow.steps.map(step => step.type).filter(Boolean);
      return widgetTypes.length > 0 ? widgetTypes : ["Banner"];
    }
    return ["Banner"]; // Default fallback
  };

  const getCTR = (recipe: Recipe) => {
    // Mock CTR data - in real app this would come from analytics
    return recipe.performance?.clickThroughRate || Math.floor(Math.random() * 50) + 20;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
            <p className="text-muted-foreground">Manage all your recipe campaigns</p>
          </div>
          <Button onClick={() => setLocation("/dashboard/recipes/catalogue")}>
            <Plus className="w-4 h-4 mr-2" />
            Create new
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Status Tabs */}
          <div className="flex gap-1">
            <Button
              variant={statusFilter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="rounded-full"
            >
              All ({statusCounts.all})
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("active")}
              className="rounded-full"
            >
              Active ({statusCounts.active})
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("inactive")}
              className="rounded-full"
            >
              Inactive ({statusCounts.inactive})
            </Button>
            <Button
              variant={statusFilter === "archived" ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("archived")}
              className="rounded-full"
            >
              Archived ({statusCounts.archived || 0})
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <Select value={placementFilter} onValueChange={setPlacementFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Home page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home page</SelectItem>
                <SelectItem value="pdp">Product page</SelectItem>
                <SelectItem value="category">Category page</SelectItem>
                <SelectItem value="checkout">Checkout page</SelectItem>
              </SelectContent>
            </Select>

            <Select value={labelsFilter} onValueChange={setLabelsFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Labels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotion">Promotion</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
                <SelectItem value="retention">Retention</SelectItem>
              </SelectContent>
            </Select>

            <Select value={audiencesFilter} onValueChange={setAudiencesFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Audiences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="new">New users</SelectItem>
                <SelectItem value="returning">Returning users</SelectItem>
                <SelectItem value="vip">VIP users</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">Loading campaigns...</div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-500 mb-6">Create your first campaign to get started.</p>
              <Button onClick={() => setLocation("/dashboard/recipes/catalogue")}>
                <Plus className="w-4 h-4 mr-2" />
                Create new campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Widgets</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecipes.map((recipe) => {
                    const widgets = getWidgetsList(recipe);
                    const ctr = getCTR(recipe);
                    
                    return (
                      <TableRow key={recipe.id}>
                        <TableCell>
                          <Switch
                            checked={recipe.status === "active"}
                            onCheckedChange={() => handleToggleStatus(recipe.id, recipe.status || "draft")}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-blue-600 cursor-pointer hover:underline">
                              {recipe.name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <span className="text-gray-400">🏷️</span>
                              {recipe.goal?.replace(/-/g, " ") || "Product discovery"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${getStatusColor(recipe.status || "draft")} rounded-full`}></div>
                            <span className="capitalize">{recipe.status || "draft"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {widgets.map((widget, idx) => (
                              <span key={idx} className="capitalize text-sm">
                                {widget.replace("-", " ")}
                                {idx < widgets.length - 1 && (
                                  <ChevronRight className="inline w-3 h-3 mx-1" />
                                )}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">Home page</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">%{ctr}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/dashboard/recipes/${recipe.id}/edit`)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteRecipe(recipe)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{recipeToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}