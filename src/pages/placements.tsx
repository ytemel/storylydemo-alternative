import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Plus,
  Copy,
  MoreVertical,
  Info,
  Search,
  Smartphone,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Placement, Widget } from "@/shared/schema";

const placementFormSchema = z.object({
  name: z.string().min(1, "Placement name is required"),
  platform: z.enum(["ios", "android", "web"]),
  sdkToken: z.string().min(1, "SDK token is required"),
  widgetId: z.number().optional(),
});

type PlacementFormData = z.infer<typeof placementFormSchema>;

export default function Placements() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<
    Placement | undefined
  >();
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [widgetFilter, setWidgetFilter] = useState<string>("all");

  const { data: placements = [], isLoading } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
  });

  const { data: widgets = [] } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });

  const form = useForm<PlacementFormData>({
    resolver: zodResolver(placementFormSchema),
    defaultValues: {
      name: "",
      platform: "android",
      sdkToken: "",
      widgetId: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PlacementFormData) => {
      // Generate a mock SDK token if not provided
      const placementData = {
        ...data,
        sdkToken:
          data.sdkToken ||
          `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
            JSON.stringify({ placement: data.name, platform: data.platform })
          )}`,
      };
      return apiRequest("POST", "/api/placements", placementData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/placements"] });
      toast({
        title: "Placement created successfully",
        description: "Your placement has been created and is ready to use.",
      });
      setShowCreator(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error creating placement",
        description:
          "There was an error creating your placement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PlacementFormData) => {
      return apiRequest("PUT", `/api/placements`, data, selectedPlacement?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/placements"] });
      toast({
        title: "Placement updated successfully",
        description: "Your placement has been updated.",
      });
      setShowCreator(false);
      setSelectedPlacement(undefined);
    },
    onError: () => {
      toast({
        title: "Error updating placement",
        description:
          "There was an error updating your placement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PlacementFormData) => {
    if (selectedPlacement) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEditPlacement = (placement: Placement) => {
    setSelectedPlacement(placement);
    form.reset({
      name: placement.name,
      platform: placement.platform as "ios" | "android" | "web",
      sdkToken: placement.sdkToken,
      widgetId: placement.widgetId || undefined,
    });
    setShowCreator(true);
  };

  const handleCloseCreator = () => {
    setShowCreator(false);
    setSelectedPlacement(undefined);
    form.reset();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "SDK token has been copied to your clipboard.",
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "ios":
        return "🍎";
      case "android":
        return "🤖";
      case "web":
        return "🌐";
      default:
        return "📱";
    }
  };

  const getWidgetName = (widgetId: number | null) => {
    if (!widgetId) return "No widget";
    const widget = widgets.find((w) => w.id === widgetId);
    return widget?.name || "Unknown widget";
  };

  const filteredPlacements = placements.filter((placement) => {
    const matchesPlatform =
      platformFilter === "all" || placement.platform === platformFilter;
    const matchesWidget =
      widgetFilter === "all" ||
      (widgetFilter === "assigned" && placement.widgetId) ||
      (widgetFilter === "unassigned" && !placement.widgetId);
    return matchesPlatform && matchesWidget;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Placements</h1>
            <p className="text-muted-foreground">
              Manage widget placement locations and configurations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowCreator(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Placement
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Welcome Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Welcome to Storyly Placements!
                </h3>
                <p className="text-muted-foreground">
                  Placements help you organize and manage where your Storyly
                  widgets appear in your app or website. Get started by creating
                  your first placement.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-muted-foreground">
                  Platform:
                </Label>
                <Select
                  value={platformFilter}
                  onValueChange={setPlatformFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="ios">iOS</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-muted-foreground">Widget:</Label>
                <Select value={widgetFilter} onValueChange={setWidgetFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Widgets</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Placements Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Placement Name
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Platform
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Widget
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      SDK Token
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        <div className="animate-pulse">
                          Loading placements...
                        </div>
                      </td>
                    </tr>
                  ) : filteredPlacements.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-muted-foreground"
                      >
                        {placements.length === 0
                          ? "No placements created yet"
                          : "No placements match your filters"}
                      </td>
                    </tr>
                  ) : (
                    filteredPlacements.map((placement) => (
                      <tr
                        key={placement.id}
                        className="hover:bg-secondary/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-medium text-foreground">
                            {placement.name}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                              <span className="text-xs">
                                {getPlatformIcon(placement.platform)}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-sm capitalize">
                              {placement.platform}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-muted-foreground text-sm">
                            {getWidgetName(placement.widgetId)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-secondary px-2 py-1 rounded max-w-[200px] truncate">
                              {placement.sdkToken}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(placement.sdkToken)
                              }
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPlacement(placement)}
                            className="h-6 w-6 p-0"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placement Creator Dialog */}
      <Dialog open={showCreator} onOpenChange={handleCloseCreator}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPlacement ? "Edit Placement" : "Create New Placement"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placement Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter placement name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="android">Android</SelectItem>
                        <SelectItem value="web">Web</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="widgetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none" ? undefined : parseInt(value)
                        )
                      }
                      value={field.value?.toString() || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select widget" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No widget</SelectItem>
                        {widgets.map((widget) => (
                          <SelectItem
                            key={widget.id}
                            value={widget.id.toString()}
                          >
                            {widget.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sdkToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SDK Token</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Auto-generated if left empty"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCreator}>
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {selectedPlacement ? "Update Placement" : "Create Placement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
