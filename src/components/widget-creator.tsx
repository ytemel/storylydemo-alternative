import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import WidgetPreview from "./widget-preview";
import type { Widget, Placement } from "@/shared/schema";
import type { WidgetType } from "@/lib/types";

const widgetFormSchema = z.object({
  name: z.string().min(1, "Widget name is required"),
  type: z.enum(["banner", "story-bar", "video-feed", "carousel"]),
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
  // selectedType?: string;  // ❌ Removed from props
}

export default function WidgetCreator({
  open,
  onOpenChange,
  widget,
}: WidgetCreatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<WidgetType>("banner"); // ✅ Keeps local state

  const { data: placements = [] } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
    enabled: open,
  });

  const form = useForm<WidgetFormData>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: {
      name: widget?.name || "",
      type: widget ? (widget.type as WidgetType) : selectedType || "banner",
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
        description: e?.message === 'Create widgets inside a Recipe.' ? 'Create widgets inside a Recipe.' :
          "There was an error creating your widget. Please try again.",
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
