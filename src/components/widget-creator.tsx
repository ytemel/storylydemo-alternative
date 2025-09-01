import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import WidgetPreview from "./widget-preview";
import type { Widget, Placement } from "@/shared/schema";
import type { WidgetType } from "@/lib/types";

const widgetFormSchema = z.object({
  name: z.string().min(1, "Widget name is required"),
  type: z.enum(["banner", "story-bar", "standalone-story-bar", "video-feed", "carousel", "swipe-card", "canvas", "quiz", "countdown"]),
  isRecipeWidget: z.boolean().default(false),
  parentRecipeId: z.number().optional(),
  content: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    buttonText: z.string().optional(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    destinationUrl: z.string().optional(),
  }),
  style: z.object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    layout: z.string().optional(),
    fontSize: z.string().optional(),
  }),
  placementId: z.number().optional(),
  status: z.enum(["draft", "active", "paused", "detached", "archived"]).default("draft"),
});

type WidgetFormData = z.infer<typeof widgetFormSchema>;

interface WidgetCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widget?: Widget;
  selectedType?: string;
}

export default function WidgetCreator({
  open,
  onOpenChange,
  widget,
  selectedType: propSelectedType,
}: WidgetCreatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<WidgetType>(propSelectedType as WidgetType || "banner");

  const { data: placements = [] } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
    enabled: open,
  });

  const form = useForm<WidgetFormData>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: {
      name: widget?.name || "",
      type: widget ? (widget.type as WidgetType) : (propSelectedType as WidgetType) || "banner",
      isRecipeWidget: (widget as any)?.isRecipeWidget || false,
      parentRecipeId: widget?.parentRecipeId || undefined,
      content: widget?.content || {},
      style: widget?.style || {
        backgroundColor: "#6B46C1",
        textColor: "#FFFFFF",
      },
      placementId: widget?.placementId || undefined,
      status: (widget?.status as any) || "draft",
    },
  });

  // Reset form when dialog opens with a new selected type
  useEffect(() => {
    if (open && !widget) {
      const newType = (propSelectedType as WidgetType) || "banner";
      setSelectedType(newType);
      form.reset({
        name: "",
        type: newType,
        isRecipeWidget: false,
        parentRecipeId: undefined,
        content: {},
        style: {
          backgroundColor: "#6B46C1",
          textColor: "#FFFFFF",
        },
        placementId: undefined,
        status: "draft",
      });
    }
  }, [open, propSelectedType, widget, form]);

  const createMutation = useMutation({
    mutationFn: async (data: WidgetFormData) => {
      return apiRequest("POST", "/api/widgets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
      toast({
        title: "Widget created successfully",
        description: "Your widget has been created and saved.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (e: any) => {
      toast({
        title: "Error creating widget",
        description: "There was an error creating your widget. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: WidgetFormData) => {
      return apiRequest("PUT", `/api/widgets`, data, widget?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
      toast({
        title: "Widget updated successfully",
        description: "Your widget has been updated and saved.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error updating widget",
        description:
          "There was an error updating your widget. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WidgetFormData) => {
    if (widget) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const watchedValues = form.watch();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {widget ? "Edit Widget" : "Create New Widget"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Widget Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter widget name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRecipeWidget"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Widget Usage Type
                        </FormLabel>
                        <div className="text-[0.8rem] text-muted-foreground">
                          {field.value 
                            ? "This widget can only be used within recipes" 
                            : "This widget can be used independently with placements"
                          }
                        </div>
                      </div>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm ${!field.value ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                              Widget Only
                            </span>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                // Prevent changing if widget is already attached
                                if (widget?.parentRecipeId || widget?.placementId) {
                                  return;
                                }
                                field.onChange(checked);
                                // Clear placement when switching to recipe widget
                                if (checked) {
                                  form.setValue("placementId", undefined);
                                }
                              }}
                              disabled={!!(widget?.parentRecipeId || widget?.placementId)}
                            />
                            <span className={`text-sm ${field.value ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                              Recipe Widget
                            </span>
                          </div>
                          {(widget?.parentRecipeId || widget?.placementId) && (
                            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                              ⚠️ Cannot change type - widget is already attached to a {widget?.parentRecipeId ? 'recipe' : 'placement'}
                            </div>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="font-semibold">Content</h3>

                  <FormField
                    control={form.control}
                    name="content.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content.buttonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter button text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content.destinationUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter destination URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Style</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="style.backgroundColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Color</FormLabel>
                          <FormControl>
                            <Input type="color" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="style.textColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text Color</FormLabel>
                          <FormControl>
                            <Input type="color" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {!form.watch("isRecipeWidget") && (
                  <FormField
                    control={form.control}
                    name="placementId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placement</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select placement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {placements.map((placement) => (
                              <SelectItem
                                key={placement.id}
                                value={placement.id.toString()}
                              >
                                {placement.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div>
            <WidgetPreview widget={watchedValues} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const data = form.getValues();
              data.status = "draft";
              if (widget) {
                updateMutation.mutate(data);
              } else {
                createMutation.mutate(data);
              }
            }}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Save Draft
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {widget ? "Update Widget" : "Create Widget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
