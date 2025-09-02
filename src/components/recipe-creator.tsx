import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Puzzle,
  Calendar,
  MapPin,
  Eye,
  Info,
  X,
  Bot,
  Plus,
  Lightbulb,
  Building2,
} from "lucide-react";
import { createRecipe, updateRecipe } from "@/server/routes/recipes";
import { recipeCategories } from "@/pages/recipe-catalogue";
import type { Recipe, InsertRecipe, Widget } from "@/shared/schema";

const recipeFormSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  template: z.string().optional(),
  category: z.enum(["standard", "widgets-only"]).default("standard"),
  productFeed: z.object({
    connected: z.boolean(),
    url: z.string().optional(),
    mappings: z.record(z.string()).optional(),
  }).optional(),
  aiPersonalization: z.boolean().default(false),
  conditions: z
    .array(
      z.object({
        field: z.string(),
        operator: z.string(),
        value: z.string(),
      })
    )
    .default([]),
  placementId: z.number().optional(),
  status: z.enum(["draft", "active", "testing", "paused"]).default("draft"),
  // Add content personalization fields
  goal: z.string().optional(),
  logic: z.string().optional(),
  configuration: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

type RecipeFormData = z.infer<typeof recipeFormSchema>;

// Type for a template
interface RecipeTemplate {
  id: string;
  name: string;
  description: string;
  flow: string[];
  personalizationDefaults: any;
}

interface RecipeCreatorProps {
  open: boolean;
  onClose: () => void;
  recipe?: Recipe;
  selectedSubCategory?: any;
  selectedTemplate?: string;
}

interface ProductCollection {
  id: string;
  name: string;
  productCount: number;
  thumbnails: string[];
  feedId: string;
}

const sampleCollections: ProductCollection[] = [
  {
    id: "summer-2025",
    name: "Summer collection 2025",
    productCount: 42,
    thumbnails: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop"
    ],
    feedId: "summer-collection"
  },
  {
    id: "winter-2025",
    name: "Winter collection 2025",
    productCount: 38,
    thumbnails: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0c0e9a31a3d?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop"
    ],
    feedId: "winter-collection"
  },
  {
    id: "spring-2025",
    name: "Spring collection 2025",
    productCount: 28,
    thumbnails: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop"
    ],
    feedId: "spring-collection"
  }
];

export default function RecipeCreator({
  open,
  onClose,
  recipe,
  selectedSubCategory: initialSubCategory,
  selectedTemplate: initialSelectedTemplate,
}: RecipeCreatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRecipeTemplate, setSelectedRecipeTemplate] = useState<string>(initialSelectedTemplate || "");
  const [ugcEnabled, setUgcEnabled] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<string>("summer-collection");
  const [selectedCollection, setSelectedCollection] = useState<string>("summer-2025");
  const [selectedWidgets, setSelectedWidgets] = useState<number[]>([]);
  const [widgetFeedAssociations, setWidgetFeedAssociations] = useState<Record<number, {
    feed?: string;
    collection?: string;
    storyGroup?: string;
    slides?: string[];
  }>>({});


  // Helper functions for widget type-specific terminology
  const getWidgetTerminology = (widgetType: string) => {
    switch (widgetType) {
      case 'story':
      case 'story-bar':
      case 'standalone-story-bar':
        return { contentType: 'Story Group', collectionType: 'Story Group' };
      default:
        return { contentType: 'Content', collectionType: 'Collection' };
    }
  };

  const getRequiredWidgetTypes = () => {
    return [];
  };

  const { data: widgets = [] } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
    enabled: open,
  });

  // Form setup
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: recipe ? {
      name: recipe.name,
      template: recipe.template as any,
      category: recipe.category as any,
      aiPersonalization: recipe.aiPersonalization || false,
      conditions: [],
      status: recipe.status as any,
      goal: recipe.goal || "",
      logic: "",
      configuration: {},
    } : {
      name: "",
      template: selectedRecipeTemplate as any,
      category: "standard",
      productFeed: {
        connected: false,
      },
      aiPersonalization: false,
      conditions: [],
      status: "draft",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: RecipeFormData) => {
      if (recipe) {
        return updateRecipe(recipe.id.toString(), data as InsertRecipe);
      } else {
        return createRecipe(data as InsertRecipe);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
      toast({
        title: recipe
          ? "Recipe updated successfully"
          : "Recipe created successfully",
        description: "Your AI-powered recipe is ready to use.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error saving your recipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RecipeFormData) => {
    // Enhance the form data with additional collected information
    const enhancedData = {
      ...data,
      template: data.template || "widget-based-recipe",
      // Add metadata about the recipe configuration
      metadata: {
        selectedWidgets: selectedWidgets,
        widgetFeedAssociations: widgetFeedAssociations,
        selectedFeed: selectedFeed,
        selectedCollection: selectedCollection,
        widgetCount: selectedWidgets.length,
        hasAI: data.aiPersonalization,
        collectionName: sampleCollections.find(c => c.id === selectedCollection)?.name,
        feedName: selectedFeed,
      }
    };
    
    console.log("Creating recipe with enhanced data:", enhancedData);
    createMutation.mutate(enhancedData as any);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 0, title: "Widget Selection", icon: Puzzle },
    { id: 1, title: "Recipe Conditions", icon: Settings },
    { id: 2, title: "Set Schedule & Audience", icon: Calendar },
    { id: 3, title: "Placement Assignment", icon: MapPin },
    { id: 4, title: "Preview & Launch", icon: Eye },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {recipe ? "Edit Recipe" : "Create New Recipe"}
                </h2>
                <p className="text-sm text-gray-600">
                  {currentStepData.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <currentStepData.icon className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 sm:p-6 max-w-4xl mx-auto pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Step 0: Widget Selection */}
              {currentStep === 0 && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Widget Selection & Content Setup
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Select widgets and configure their content feeds for this recipe.
                    </p>
                  </div>

                  {/* Widget Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Available Recipe Widgets</h4>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open('/dashboard/widgets', '_blank')}
                      >
                        Open Widget Libraryjjj
                      </Button>
                    </div>

                    {(() => {
                      // Filter for recipe widgets only
                      const recipeWidgets = widgets.filter((w: any) => w.isRecipeWidget);
                      
                      if (recipeWidgets.length === 0) {
                        return (
                          <Card className="p-6 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Puzzle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Recipe Widgets Available</h3>
                            <p className="text-gray-600 mb-4">
                              You need to create recipe widgets first before building recipes.
                            </p>
                            <Button 
                              onClick={() => window.open('/dashboard/widgets', '_blank')}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Create Recipe Widgets
                            </Button>
                          </Card>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          {recipeWidgets.map((widget: any) => {
                            const isSelected = selectedWidgets.includes(widget.id);
                            const terminology = getWidgetTerminology(widget.type);
                            
                            return (
                              <Card 
                                key={widget.id}
                                className={`transition-all border-l-4 ${
                                  isSelected
                                    ? 'border-l-purple-500 bg-purple-50'
                                    : 'border-l-gray-300'
                                }`}
                              >
                                <CardContent className="p-4">
                                  {/* Widget Header */}
                                  <div 
                                    className="flex items-center justify-between mb-3 cursor-pointer"
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedWidgets(selectedWidgets.filter(id => id !== widget.id));
                                        // Remove feed associations when widget is deselected
                                        const newAssociations = { ...widgetFeedAssociations };
                                        delete newAssociations[widget.id];
                                        setWidgetFeedAssociations(newAssociations);
                                      } else {
                                        setSelectedWidgets([...selectedWidgets, widget.id]);
                                        // Initialize feed associations for new widget
                                        setWidgetFeedAssociations({
                                          ...widgetFeedAssociations,
                                          [widget.id]: {}
                                        });
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-4 h-4 border-2 rounded ${
                                        isSelected 
                                          ? 'bg-purple-600 border-purple-600' 
                                          : 'border-gray-300'
                                      }`}>
                                        {isSelected && (
                                          <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium flex items-center gap-2">
                                          {widget.name}
                                        </div>
                                        <div className="text-sm text-gray-500 capitalize">
                                          {widget.type.replace('-', ' ')} widget
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-gray-400">
                                      {isSelected ? '−' : '+'}
                                    </div>
                                  </div>

                                  {/* Content Configuration - Only show when selected */}
                                  {isSelected && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <h5 className="font-medium text-gray-900">
                                            Content Configuration
                                          </h5>
                                          <div className="text-xs text-gray-500">
                                            {widget.type.replace('-', ' ')}
                                          </div>
                                        </div>

                                        {/* Content Feed Selection */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Feed
                                            </label>
                                            <Select 
                                              value={widgetFeedAssociations[widget.id]?.feed || selectedFeed} 
                                              onValueChange={(value) => {
                                                setSelectedFeed(value);
                                                setWidgetFeedAssociations({
                                                  ...widgetFeedAssociations,
                                                  [widget.id]: {
                                                    ...widgetFeedAssociations[widget.id],
                                                    feed: value
                                                  }
                                                });
                                              }}
                                            >
                                              <SelectTrigger className="w-full">
                                                <div className="flex items-center gap-2">
                                                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                                  <SelectValue placeholder="Select feed" />
                                                </div>
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="summer-collection">
                                                  <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                                    Summer collection
                                                  </div>
                                                </SelectItem>
                                                <SelectItem value="winter-collection">
                                                  <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                                    Winter collection
                                                  </div>
                                                </SelectItem>
                                                <SelectItem value="spring-collection">
                                                  <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                                    Spring collection
                                                  </div>
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Collection
                                            </label>
                                            <Select 
                                              value={widgetFeedAssociations[widget.id]?.collection || selectedCollection} 
                                              onValueChange={(value) => {
                                                setSelectedCollection(value);
                                                setWidgetFeedAssociations({
                                                  ...widgetFeedAssociations,
                                                  [widget.id]: {
                                                    ...widgetFeedAssociations[widget.id],
                                                    collection: value
                                                  }
                                                });
                                              }}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select collection" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {sampleCollections.map((collection) => (
                                                  <SelectItem key={collection.id} value={collection.id}>
                                                    <div className="flex items-center gap-2">
                                                      <div className="flex -space-x-1">
                                                        {collection.thumbnails.slice(0, 3).map((thumb, i) => (
                                                          <img
                                                            key={i}
                                                            src={thumb}
                                                            alt=""
                                                            className="w-6 h-6 rounded border-2 border-white object-cover"
                                                          />
                                                        ))}
                                                      </div>
                                                      <div>
                                                        <div className="font-medium">{collection.name}</div>
                                                        <div className="text-xs text-gray-500">{collection.productCount} products</div>
                                                      </div>
                                                    </div>
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>

                                        {/* Configuration Status */}
                                        <div className="flex items-center gap-2 text-xs">
                                          {widgetFeedAssociations[widget.id]?.collection || selectedCollection ? (
                                            <>
                                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                              <span className="text-green-700">Content configured</span>
                                            </>
                                          ) : (
                                            <>
                                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                              <span className="text-amber-700">Content configuration required</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Step 1: Recipe Conditions */}
              {currentStep === 1 && (
                <div className="space-y-6 sm:space-y-8">
                  {/* AI Content Personalization */}
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <h3 className="text-lg font-medium">AI Content Personalization</h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            Use AI to personalize content based on user behavior and preferences
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Switch
                            checked={form.watch("aiPersonalization")}
                            onCheckedChange={(checked) => form.setValue("aiPersonalization", checked)}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    {/* Smart Sorting - Show when AI is enabled */}
                    {form.watch("aiPersonalization") && (
                      <CardContent className="space-y-6 pt-0">
                        <div className="border-t pt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Bot className="w-5 h-5" />
                            <h4 className="text-lg font-medium">Smart Sorting</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-6">
                            Set smart sorting conditions for when this recipe should be triggered
                          </p>
                          
                          {/* Sorting Logic Section */}
                          <div>
                            <h5 className="text-base font-medium mb-4">Sorting logic</h5>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Storyly AI Option */}
                              <label className="relative cursor-pointer">
                                <input
                                  type="radio"
                                  name="sortingLogic"
                                  value="storyly-ai"
                                  defaultChecked
                                  className="sr-only"
                                />
                                <div className="border-2 border-purple-500 bg-purple-50 rounded-lg p-4 transition-all duration-200">
                                  <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-purple-500 rounded-full flex items-center justify-center">
                                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <span className="text-purple-600">✨</span>
                                        <span className="font-medium text-gray-900">Storyly AI</span>
                                      </div>
                                      <div className="relative group">
                                        <div className="w-4 h-4 text-gray-400 cursor-help">
                                          <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                          Storyly ranks your content dynamically based on each customer's search, purchase, and browsing behaviour
                                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </label>
                              
                              {/* Other sorting options */}
                              <label className="relative cursor-pointer">
                                <input type="radio" name="sortingLogic" value="price-low-high" className="sr-only" />
                                <div className="border-2 border-gray-200 bg-white rounded-lg p-4 transition-all duration-200 hover:border-gray-300">
                                  <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                    <span className="font-medium text-gray-900">Price: Low to High</span>
                                  </div>
                                </div>
                              </label>
                              
                              <label className="relative cursor-pointer">
                                <input type="radio" name="sortingLogic" value="price-high-low" className="sr-only" />
                                <div className="border-2 border-gray-200 bg-white rounded-lg p-4 transition-all duration-200 hover:border-gray-300">
                                  <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                    <span className="font-medium text-gray-900">Price: High to Low</span>
                                  </div>
                                </div>
                              </label>
                              
                              <label className="relative cursor-pointer">
                                <input type="radio" name="sortingLogic" value="recently-added" className="sr-only" />
                                <div className="border-2 border-gray-200 bg-white rounded-lg p-4 transition-all duration-200 hover:border-gray-300">
                                  <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                    <span className="font-medium text-gray-900">Recently Added</span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                  
                  {/* Conditions Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        <h3 className="text-lg font-medium">Conditions</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Define additional conditions to either end this recipe or trigger the next one.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <Select defaultValue="unique_user_view">
                            <SelectTrigger className="w-full sm:w-48 h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unique_user_view">Unique User View</SelectItem>
                              <SelectItem value="engaged_but_no_click">Engaged but no click</SelectItem>
                              <SelectItem value="completion_rate">Completion Rate</SelectItem>
                              <SelectItem value="per_day_cap">Per Day Cap</SelectItem>
                              <SelectItem value="max_frequency_cap">Max Frequency Cap</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="equals">
                            <SelectTrigger className="w-full sm:w-32 h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input placeholder="Value" className="flex-1 h-12" />
                        </div>
                        
                        {/* Action Options */}
                        <div className="space-y-4">
                          <div className="text-base font-medium text-gray-900">
                            When condition is met:
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="end-recipe"
                                name="condition-action"
                                value="end-recipe"
                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                              />
                              <label htmlFor="end-recipe" className="text-base text-gray-700">
                                End Recipe
                              </label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="trigger-next"
                                name="condition-action"
                                value="trigger-next"
                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                              />
                              <label htmlFor="trigger-next" className="text-base text-gray-700">
                                Trigger next recipe
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Set Schedule & Audience */}
              {currentStep === 2 && (
                <div className="space-y-6 sm:space-y-8">

                  {/* Schedule Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <h3 className="text-lg font-medium">Schedule</h3>
                      <p className="text-sm text-gray-600">
                        Choose whether to publish the recipe immediately or schedule it for later.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="publish-now"
                            name="schedule-type"
                            value="publish-now"
                            defaultChecked
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <label htmlFor="publish-now" className="text-base text-gray-700">
                            Publish now
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="schedule-later"
                            name="schedule-type"
                            value="schedule-later"
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <label htmlFor="schedule-later" className="text-base text-gray-700">
                            Schedule for later
                          </label>
                        </div>
                      </div>

                      {/* Date inputs */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <Input 
                              type="date" 
                              defaultValue="2023-12-11"
                              className="h-12"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <Input 
                              type="date" 
                              placeholder="dd/mm/yyyy"
                              className="h-12"
                            />
                          </div>
                        </div>
                        
                        {/* Information box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800">
                              When this recipe goes live on 2025-09-03, the currently active recipe will be automatically deactivated.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Audience Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <h3 className="text-lg font-medium">Audience</h3>
                      <p className="text-sm text-gray-600">
                        Define who will see this. You can target specific audiences or label-based segments.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">

                      {/* Your Audiences Subsection */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-medium text-gray-900">Your Audiences</h4>
                          <div className="relative group">
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              Target specific audience segments
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select defaultValue="include">
                            <SelectTrigger className="w-24 h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="include">Include</SelectItem>
                              <SelectItem value="exclude">Exclude</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-gray-600">users who are in the selected audience will be targeted</span>
                          <Select>
                            <SelectTrigger className="flex-1 h-12">
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="new">New Visitors</SelectItem>
                              <SelectItem value="returning">Returning Users</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Filter by Labels Subsection */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-medium text-gray-900">Filter by Labels</h4>
                          <div className="relative group">
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              Filter users by custom labels
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select defaultValue="include">
                            <SelectTrigger className="w-24 h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="include">Include</SelectItem>
                              <SelectItem value="exclude">Exclude</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-gray-600">users who are in the label will be targeted</span>
                          <Button variant="outline" size="sm" className="h-12">
                            <Plus className="w-4 h-4 mr-2" />
                            Add a label
                          </Button>
                        </div>
                      </div>

                      {/* Condition Logic */}
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded">AND</span>
                      </div>
                      
                      <Button variant="outline" size="sm" className="h-12">
                        <Plus className="w-4 h-4 mr-2" />
                        New Condition
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Placement Assignment */}
              {currentStep === 3 && (
                <div className="space-y-6 sm:space-y-8">

                  {/* Placement Location */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-3">
                      Placement Location
                    </label>
                    <Select
                      value={form.watch("placementId")?.toString() || ""}
                      onValueChange={(value) => form.setValue("placementId", parseInt(value))}
                    >
                      <SelectTrigger className="w-full h-12 text-base">
                        <SelectValue placeholder="Select placement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Home Page</span>
                            <Badge variant="outline" className="ml-2">
                              Web
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Product Page</span>
                            <Badge variant="outline" className="ml-2">
                              Web
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Checkout Page</span>
                            <Badge variant="outline" className="ml-2">
                              Web
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Mobile App</span>
                            <Badge variant="outline" className="ml-2">
                              Mobile
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recipe Name */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-3">
                      Recipe Name
                    </label>
                    <Input
                      placeholder="e.g., Summer Sale Campaign"
                      className="h-12 text-base"
                      value={form.watch("name")}
                      onChange={(e) => form.setValue("name", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Preview & Launch */}
              {currentStep === 4 && (
                <div className="space-y-6 sm:space-y-8">
                  
                  {/* Recipe Flow Preview */}
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        <h3 className="text-lg font-medium">Recipe Flow Preview</h3>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        {/* Template */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            1
                          </div>
                          <div>
                            <div className="font-semibold text-base">Template:</div>
                            <div className="text-sm text-gray-600">Flow:</div>
                          </div>
                        </div>

                        {/* Product Collection */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            2
                          </div>
                          <div>
                            <div className="font-semibold text-base">Product Collection: Selected</div>
                            <div className="text-sm text-gray-600">
                              Collection: {sampleCollections.find(c => c.id === selectedCollection)?.name || "Summer collection 2025"}
                            </div>
                          </div>
                        </div>

                        {/* AI Personalization */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            3
                          </div>
                          <div>
                            <div className="font-semibold text-base">
                              AI Personalization: {form.watch("aiPersonalization") ? "Enabled" : "Disabled"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {form.watch("aiPersonalization") 
                                ? "Content will be personalized based on user behavior" 
                                : "Content will not be personalized"
                              }
                            </div>
                          </div>
                        </div>

                        {/* Conditions */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            4
                          </div>
                          <div>
                            <div className="font-semibold text-base">Conditions: Not Configured</div>
                            <div className="text-sm text-gray-600">No additional conditions defined</div>
                          </div>
                        </div>

                        {/* Schedule */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            5
                          </div>
                          <div>
                            <div className="font-semibold text-base">Schedule: Publish Now</div>
                            <div className="text-sm text-gray-600">Recipe will be published immediately</div>
                          </div>
                        </div>

                        {/* Audience */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            6
                          </div>
                          <div>
                            <div className="font-semibold text-base">Audience: All Users</div>
                            <div className="text-sm text-gray-600">Targeting all users (no specific segments)</div>
                          </div>
                        </div>

                        {/* Placement */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            7
                          </div>
                          <div>
                            <div className="font-semibold text-base">
                              Placement: {form.watch("placementId") 
                                ? (() => {
                                    const placements = {
                                      1: "Home Page",
                                      2: "Product Page", 
                                      3: "Checkout Page",
                                      4: "Mobile App"
                                    };
                                    return placements[form.watch("placementId") as keyof typeof placements] || "Homepage Hero";
                                  })()
                                : "Homepage Hero"
                              }
                            </div>
                            <div className="text-sm text-gray-600">
                              {form.watch("placementId") && form.watch("placementId") === 4 ? "android" : "web"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Launch Status */}
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-900">
                      Launch Status
                    </label>
                    <Select
                      value={form.watch("status") || "draft"}
                      onValueChange={(value) => form.setValue("status", value as any)}
                    >
                      <SelectTrigger className="w-full h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Save as Draft</SelectItem>
                        <SelectItem value="testing">Launch for Testing</SelectItem>
                        <SelectItem value="active">Launch Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* AI Configuration Summary */}
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        <h3 className="text-lg font-medium">AI Configuration Summary</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Recipe Flow Chart */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Recipe Flow Chart</h4>
                          
                          {/* Start Recipe */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                              <span className="font-medium">Start Recipe</span>
                            </div>
                          </div>

                          {/* Template Selection */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center">
                              <div className="font-medium">Template: Selected</div>
                              <div className="text-xs opacity-90">Widget-based recipe flow</div>
                            </div>
                          </div>

                          {/* Product Collection */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-purple-500 text-white px-4 py-2 rounded-lg text-center">
                              <div className="font-medium">Product Collection</div>
                              <div className="text-xs opacity-90">
                                {sampleCollections.find(c => c.id === selectedCollection)?.name || "Summer collection 2025"}
                              </div>
                            </div>
                          </div>

                          {/* AI Personalization Decision */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-center">
                              <div className="font-medium">AI Personalization</div>
                              <div className="text-xs opacity-90">
                                {form.watch("aiPersonalization") ? "Enabled" : "Disabled"}
                              </div>
                            </div>
                          </div>

                          {/* Schedule */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-center">
                              <div className="font-medium">Schedule</div>
                              <div className="text-xs opacity-90">Publish Now</div>
                            </div>
                          </div>

                          {/* Audience Targeting */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-teal-500 text-white px-4 py-2 rounded-lg text-center">
                              <div className="font-medium">Audience Targeting</div>
                              <div className="text-xs opacity-90">All Users</div>
                            </div>
                          </div>

                          {/* Placement */}
                          <div className="flex items-center justify-center">
                            <div className="bg-pink-500 text-white px-4 py-2 rounded-lg text-center">
                              <div className="font-medium">Placement</div>
                              <div className="text-xs opacity-90">
                                {(() => {
                                  const placements = {
                                    1: "Home Page",
                                    2: "Product Page", 
                                    3: "Checkout Page",
                                    4: "Mobile App"
                                  };
                                  return placements[form.watch("placementId") as keyof typeof placements] || "Homepage Hero";
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            </form>
          </Form>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="border-t bg-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={
                  (currentStep === 0 && selectedWidgets.length === 0) ||
                  (currentStep === 3 && (!form.watch("name") || !form.watch("placementId")))
                }
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  createMutation.isPending || 
                  !form.watch("name") || 
                  selectedWidgets.length === 0 ||
                  !form.watch("placementId")
                }
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                {createMutation.isPending ? "Creating..." : recipe ? "Update Recipe" : "Create Recipe"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
