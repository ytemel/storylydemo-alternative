import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Wand2, 
  Bot, 
  Settings, 
  Users, 
  MapPin, 
  Eye,
  CheckCircle,
  ShoppingBag,
  Calendar,
  Info
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { createRecipe, updateRecipe } from "@/server/routes/recipes";
import { recipeCategories } from "@/pages/recipes";
import type { Recipe, InsertRecipe, Placement } from "@/shared/schema";

const recipeFormSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  template: z.string().min(1, "Select a template"),
  category: z.enum(["standard", "widgets-only"]).default("standard"),
  productFeed: z.object({
    connected: z.boolean(),
    url: z.string().optional(),
    mappings: z.record(z.string()).optional(),
  }),
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

// Type for a sub category
interface RecipeSubCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  templates: RecipeTemplate[];
}

const templateOptions = [
  {
    value: "highlight-campaign-personalization",
    label: "Highlight a campaign with Personalization Engine",
    description:
      "Highlight a campaign using AI-powered personalization. Only banner widget is used. Smart Sortings and user history conditions are preselected.",
    flow: ["Banner"],
    icon: Wand2,
  },
  {
    value: "banner-to-feed",
    label: "Banner to Vertical Feed",
    description:
      "Start with a banner, then show a vertical product feed. Page Visit and Session Login are preselected as personalization conditions.",
    flow: ["Banner", "Vertical Feed"],
    icon: ShoppingBag,
    personalizationDefaults: {
      goal: "Drive engagement from banner to feed",
      logic:
        "If user has Page Visit OR Session Login, show banner then vertical feed.",
      configuration: {
        conditions: [
          { field: "page_visit", operator: "exists", value: "" },
          { field: "session_login", operator: "exists", value: "" },
        ],
        or: true,
      },
    },
  },
];

const conditionOptions = [
  { value: "unique_user_view", label: "Unique User View" },
  { value: "engaged_but_no_click", label: "Engaged but no click" },
  { value: "completion_rate", label: "Completion Rate" },
  { value: "per_day_cap", label: "Per Day Cap" },
  { value: "max_frequency_cap", label: "Max Frequency Cap" },
];

const operatorOptions = [
  { value: "equals", label: "Equals" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
];

interface RecipeCreatorProps {
  open: boolean;
  onClose: () => void;
  recipe?: Recipe;
  selectedSubCategory?: string;
}

// Add new interfaces for feeds and collections
interface ProductFeed {
  id: string;
  name: string;
  icon: string;
}

interface ProductCollection {
  id: string;
  name: string;
  productCount: number;
  thumbnails: string[];
  feedId: string;
}

// Sample data for feeds and collections
const sampleFeeds: ProductFeed[] = [
  { id: "summer-collection", name: "Summer collection", icon: "🛍️" },
  { id: "winter-collection", name: "Winter collection", icon: "❄️" },
  { id: "spring-collection", name: "Spring collection", icon: "🌸" },
];

const sampleCollections: ProductCollection[] = [
  {
    id: "summer-2025",
    name: "Summer collection 2025",
    productCount: 45,
    thumbnails: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop"
    ],
    feedId: "summer-collection"
  },
  {
    id: "sample-collection",
    name: "Sample collection",
    productCount: 16,
    thumbnails: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop"
    ],
    feedId: "summer-collection"
  },
  {
    id: "my-collection",
    name: "My product collection",
    productCount: 16,
    thumbnails: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop"
    ],
    feedId: "summer-collection"
  },
  {
    id: "winter-2025",
    name: "Winter collection 2025",
    productCount: 32,
    thumbnails: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop"
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
}: RecipeCreatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [ugcEnabled, setUgcEnabled] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<string>("summer-collection");
  const [selectedCollection, setSelectedCollection] = useState<string>("summer-2025");

  // Debug log
  console.log("RecipeCreator selectedSubCategory prop:", initialSubCategory);

  // Find the selected sub category object for display and template rendering
  const selectedSubCategoryObj = (() => {
    if (!initialSubCategory) return null;
    for (const cat of recipeCategories) {
      if (!cat.templates) continue;
      for (const t of cat.templates) {
        if (t.id === initialSubCategory) return t;
      }
    }
    return null;
  })();
  console.log("RecipeCreator selectedSubCategoryObj:", selectedSubCategoryObj);

  const { data: placements = [] } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
    enabled: open,
  });

  const personalizationDefaults = getPersonalizationDefaults(
    (recipe?.template as string) || "banner-feed"
  );

  const isHighlightCampaignPersonalization =
    recipe?.template === "highlight-campaign-personalization";

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: recipe?.name || "",
      template: "highlight-campaign-personalization",
      category: (recipe as any)?.category || (initialSubCategory === 'widgets-only-picker' ? 'widgets-only' : 'standard'),
      productFeed: {
        connected: true,
        url: recipe?.productFeed?.url ?? "",
        mappings: recipe?.productFeed?.mappings ?? {},
      },
      aiPersonalization: true,
      conditions: isHighlightCampaignPersonalization ? [] : [],
      status:
        (recipe?.status as "draft" | "active" | "testing" | "paused") ||
        "draft",
      goal:
        recipe?.goal ||
        (personalizationDefaults && personalizationDefaults.goal) ||
        "",
    },
  });

  // Autofill personalization defaults when template changes
  const watchedTemplate = form.watch("template");
  useEffect(() => {
    const defaults = getPersonalizationDefaults(watchedTemplate as string);
    if (defaults) {
      if (typeof defaults.goal === "string") {
        form.setValue("goal", defaults.goal);
      }
      if (typeof defaults.logic === "string") {
        form.setValue("logic", defaults.logic);
      }
      if (defaults.configuration && typeof defaults.configuration === "object") {
        Object.entries(defaults.configuration).forEach(([key, value]) => {
          // @ts-ignore
          form.setValue(`configuration.${key}`, value as any);
        });
      }
    }
  }, [watchedTemplate, form]);

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

  const onSubmit: import("react-hook-form").SubmitHandler<RecipeFormData> = (
    data
  ) => {
    createMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 0, title: "Template Selection", icon: ShoppingBag },
    { id: 1, title: "Product Feed", icon: ShoppingBag },
    { id: 2, title: "Recipe Conditions", icon: Settings },
    { id: 3, title: "Set Schedule & Audience", icon: Calendar },
    { id: 4, title: "Placement Assignment", icon: MapPin },
    { id: 5, title: "Preview & Launch", icon: Eye },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const selectedTemplateObj = templateOptions.find(
    (t) =>
      t.value ===
      (form.watch("template") as
        | "banner-feed"
        | "story-quiz-card"
        | "carousel-ugc-banner")
  );

  function getTemplatesForSubCategory(): RecipeTemplate[] {
    if (!initialSubCategory) return [];
    for (const cat of recipeCategories) {
      if (!cat.templates) continue;
      for (const t of cat.templates) {
        if (
          typeof t === "object" &&
          Array.isArray((t as any).templates) &&
          t.id === initialSubCategory
        ) {
          return (t as any).templates;
        }
      }
    }
    return [];
  }

  // Debug logging
  console.log("selectedSubCategory:", initialSubCategory);
  const templatesForSubCategory = getTemplatesForSubCategory();
  console.log("templatesForSubCategory:", templatesForSubCategory);

  // Find the selected sub category object for display and template rendering
  const selectedSubCategoryObjForDisplay = (() => {
    for (const cat of recipeCategories) {
      if (!cat.templates) continue;
      for (const t of cat.templates) {
        if (t.id === initialSubCategory) return t;
      }
    }
    return null;
  })();
  console.log(
    "RecipeCreator selectedSubCategoryObjForDisplay:",
    selectedSubCategoryObjForDisplay
  );

  // Filter collections based on selected feed
  const filteredCollections = sampleCollections.filter(
    collection => collection.feedId === selectedFeed
  );

  // Helper to determine if we should auto-enable and pre-fill smart sorting
  const shouldAutoSmartSort =
    selectedSubCategoryObjForDisplay &&
    selectedSubCategoryObjForDisplay.id === "seasonal-sale" &&
    selectedTemplate === "banner-to-countdown";
  const sortingChips: { label: string }[] = [
  ];
  const hasSortingChips =
    (form.watch("conditions") && form.watch("conditions").length > 0) ||
    shouldAutoSmartSort;
  const shouldAutoEnableAI = hasSortingChips || shouldAutoSmartSort;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          {currentStep > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
        </div>
        
        <div className="text-center flex-1 px-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Step {currentStep + 1} of {steps.length}: {currentStepData.title}
          </h1>
          {selectedSubCategoryObjForDisplay && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {selectedSubCategoryObjForDisplay.name}
            </p>
          )}
        </div>

        {/* Show Next button for steps 1-5, Create button for step 6 */}
        {currentStep < 5 ? (
          <Button
            onClick={nextStep}
                    disabled={
          (currentStep === 0 && !form.watch("template")) ||
          (currentStep === 1 && !selectedCollection) ||
          (currentStep === 4 &&
            (!form.watch("placementId") || !form.watch("name")))
        }
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 h-10 sm:h-12"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 sm:ml-2" />
          </Button>
        ) : (
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 h-10 sm:h-12"
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        )}
      </div>

      {/* Progress Bar - Fixed */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Progress: {Math.round(progress)}%
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 sm:p-6 max-w-4xl mx-auto pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 0: Template Selection */}
              {currentStep === 0 && (
                <div className="space-y-6">               
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {!selectedSubCategoryObjForDisplay ||
                            !selectedSubCategoryObjForDisplay.templates ||
                            selectedSubCategoryObjForDisplay.templates.length ===
                              0 ? (
                              <div className="text-gray-400 col-span-1 lg:col-span-2 text-center py-12">
                                No templates available for this sub category.
                              </div>
                            ) : (
                              selectedSubCategoryObjForDisplay.templates.map(
                                (template: any) => (
                                  <Card
                                    key={template.id}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${
                                      field.value === template.id
                                        ? "border-purple-500 bg-purple-50 shadow-lg"
                                        : "hover:border-gray-300"
                                    }`}
                                    onClick={() => {
                                      field.onChange(template.id);
                                      setSelectedTemplate(template.id);
                                    }}
                                  >
                                    <CardContent className="p-4 sm:p-6">
                                      <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                                        {template.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 mb-3">
                                        {template.description}
                                      </p>
                                      <div className="space-y-2 sm:space-y-3">
                                        {selectedSubCategoryObjForDisplay?.id !== "widgets-only-picker" && template.flow &&
                                          template.flow.map(
                                            (step: string, index: number) => (
                                              <div
                                                key={index}
                                                className="flex items-center gap-2 sm:gap-3"
                                              >
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                                                <span className="text-sm sm:text-base text-gray-700">
                                                  {step}
                                                </span>
                                              </div>
                                            )
                                          )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              )
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 1: Product Feed */}
              {currentStep === 1 && (
                <div className="space-y-6 sm:space-y-8">
                  {/* Product Collection Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        Product collection
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Select the product feed that contains the items you want to showcase in your swipe card.
                      </p>
                    </div>

                    {/* Feeds Section */}
                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base font-medium">Feeds</Label>
                      <Select value={selectedFeed} onValueChange={setSelectedFeed}>
                        <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🛍️</span>
                              <span>{sampleFeeds.find(feed => feed.id === selectedFeed)?.name}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {sampleFeeds.map((feed) => (
                            <SelectItem key={feed.id} value={feed.id}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{feed.icon}</span>
                                <span>{feed.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Collections Section */}
                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base font-medium">Collections</Label>
                      <div className="space-y-3">
                        {filteredCollections.map((collection) => (
                          <Card
                            key={collection.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedCollection === collection.id
                                ? "border-purple-500 bg-purple-50 shadow-md"
                                : "hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedCollection(collection.id)}
                          >
                            <CardContent className="p-4 sm:p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                                    {selectedCollection === collection.id ? (
                                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    ) : (
                                      <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                                      {collection.name}
                                    </h4>
                                    <p className="text-sm sm:text-base text-gray-600">
                                      {collection.productCount} products
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  {collection.thumbnails.map((thumbnail, index) => (
                                    <div
                                      key={index}
                                      className="w-8 h-8 sm:w-10 sm:h-10 rounded border border-gray-200 overflow-hidden flex-shrink-0"
                                    >
                                      <img
                                        src={thumbnail}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Field Mappings Section */}
                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                        Field Mappings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div className="text-sm sm:text-base text-gray-600">
                        Map your product fields to Storyly fields for optimal display
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
                        <div className="space-y-2">
                          <Label>Product Title → title</Label>
                          <Label>Product Image → image_url</Label>
                          <Label>Product Price → price</Label>
                        </div>
                        <div className="space-y-2">
                          <Label>Product URL → link</Label>
                          <Label>Product Description → description</Label>
                          <Label>Product Category → category</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 sm:p-6">
                    <div className="space-y-1">
                      <FormLabel className="text-base sm:text-lg font-medium">Enable UGC</FormLabel>
                      <div className="text-sm sm:text-base text-gray-600">
                        Allow user generated content in this recipe (optional)
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={ugcEnabled}
                        onCheckedChange={setUgcEnabled}
                      />
                    </FormControl>
                  </FormItem>
                </div>
              )}

              {/* Step 2: Recipe Conditions */}
              {currentStep === 2 && (
                <div className="space-y-6 sm:space-y-8">                
                  {personalizationDefaults && (
                    <Card className="mb-6 sm:mb-8 border-purple-500 border-2 bg-purple-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-700 text-base sm:text-lg">
                          <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                          Content Personalization
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <Label className="text-sm sm:text-base font-medium">Goal</Label>
                            <Input
                              value={form.watch("goal")}
                              onChange={(e) =>
                                form.setValue("goal", e.target.value)
                              }
                              className="h-10 sm:h-12 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label className="text-sm sm:text-base font-medium">Logic</Label>
                            <Textarea
                              value={form.watch("logic")}
                              onChange={(e) =>
                                form.setValue("logic", e.target.value)
                              }
                              className="min-h-[40px] sm:min-h-[48px] text-sm sm:text-base"
                            />
                          </div>
                        </div>
                        {/* Render configuration fields dynamically */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          {Object.entries(
                            personalizationDefaults?.configuration || {}
                          ).map(([key, val]) => (
                            <div key={key}>
                              <Label className="capitalize text-sm sm:text-base font-medium">
                                {key.replace(/([A-Z])/g, " $1")}
                              </Label>
                              <Input
                                value={form.watch(`configuration.${key}`) ?? val}
                                onChange={(e) =>
                                  form.setValue(
                                    `configuration.${key}`,
                                    e.target.value
                                  )
                                }
                                className="h-10 sm:h-12 text-sm sm:text-base"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card className="border-2">
                    <CardHeader>
                      <FormField
                        control={form.control}
                        name="aiPersonalization"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                              <FormLabel className="text-base sm:text-lg font-medium flex items-center gap-2">
                                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                                AI Content Personalization
                              </FormLabel>
                              <div className="text-sm sm:text-base text-gray-600">
                                Use AI to personalize content based on user behavior and preferences
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={
                                  Boolean(shouldAutoEnableAI)
                                    ? true
                                    : Boolean(field.value)
                                }
                                onCheckedChange={field.onChange}
                                disabled={Boolean(shouldAutoEnableAI)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardHeader>
                    {/* Smart Sorting only if AI is enabled */}
                    {(form.watch("aiPersonalization") || shouldAutoEnableAI) && (
                      <CardContent className="space-y-4 sm:space-y-6 pt-0">
                        <div className="border-t pt-4 sm:pt-6">
                          <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-base sm:text-lg font-medium">Smart Sorting</span>
                          </div>
                          <div className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                            Set smart sorting conditions for when this recipe should be triggered
                          </div>
                          
                          {/* Sorting Logic Section */}
                          <div className="mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <span className="text-base sm:text-lg font-medium">Sorting logic</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              {/* Storyly AI Option */}
                              <label className="relative cursor-pointer">
                                <input
                                  type="radio"
                                  name="sortingLogic"
                                  value="storyly-ai"
                                  defaultChecked
                                  className="sr-only"
                                />
                                <div className="border-2 border-purple-500 bg-purple-50 rounded-lg p-4 sm:p-5 transition-all duration-200">
                                  <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-purple-500 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                      <span className="font-medium text-gray-900">Storyly AI</span>
                                      <div className="relative group">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 cursor-help">
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
                              
                              {/* Price: Low to High Option */}
                              <label className="relative cursor-pointer">
                                <input
                                  type="radio"
                                  name="sortingLogic"
                                  value="price-low-high"
                                  className="sr-only"
                                />
                                <div className="border-2 border-gray-200 bg-white rounded-lg p-4 sm:p-5 transition-all duration-200 hover:border-gray-300">
                                  <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-transparent rounded-full"></div>
                                    </div>
                                    <span className="font-medium text-gray-900">Price: Low to High</span>
                                  </div>
                                </div>
                              </label>
                              
                              {/* Price: High to Low Option */}
                              <label className="relative cursor-pointer">
                                <input
                                  type="radio"
                                  name="sortingLogic"
                                  value="price-high-low"
                                  className="sr-only"
                                />
                                <div className="border-2 border-gray-200 bg-white rounded-lg p-4 sm:p-5 transition-all duration-200 hover:border-gray-300">
                                  <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-transparent rounded-full"></div>
                                    </div>
                                    <span className="font-medium text-gray-900">Price: High to Low</span>
                                  </div>
                                </div>
                              </label>
                              
                              {/* Recently Added Option */}
                              <label className="relative cursor-pointer">
                                <input
                                  type="radio"
                                  name="sortingLogic"
                                  value="recently-added"
                                  className="sr-only"
                                />
                                <div className="border-2 border-gray-200 bg-white rounded-lg p-4 sm:p-5 transition-all duration-200 hover:border-gray-300">
                                  <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-transparent rounded-full"></div>
                                    </div>
                                    <span className="font-medium text-gray-900">Recently Added</span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                          
                          {/* Move sorting chips here */}
                          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                            {sortingChips.map((cond, idx, arr) => (
                              <>
                                <span
                                  key={cond.label}
                                  className="px-3 py-1 sm:px-4 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium"
                                >
                                  {cond.label}
                                </span>
                                {idx < arr.length - 1 && (
                                  <span className="text-lg text-gray-400 font-bold align-middle">
                                    ||
                                  </span>
                                )}
                              </>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                  
                  {/* Conditions Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                        Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div className="text-sm sm:text-base text-gray-600">
                      Define additional conditions to either end this recipe or trigger the next one.
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <Select defaultValue={conditionOptions[0].value}>
                            <SelectTrigger className="w-full sm:w-48 h-10 sm:h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select defaultValue={operatorOptions[0].value}>
                            <SelectTrigger className="w-full sm:w-32 h-10 sm:h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operatorOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input placeholder="Value" className="flex-1 h-10 sm:h-12" />
                        </div>
                        
                        {/* Action Options */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="text-sm sm:text-base font-medium text-gray-900">
                            When condition is met:
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="end-recipe"
                                name="condition-action"
                                value="end-recipe"
                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                              />
                              <label htmlFor="end-recipe" className="text-sm sm:text-base text-gray-700">
                                End Recipe
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="trigger-next"
                                name="condition-action"
                                value="trigger-next"
                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                              />
                              <label htmlFor="trigger-next" className="text-sm sm:text-base text-gray-700">
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

              {/* Step 3: Set Schedule & Audience */}
              {currentStep === 3 && (
                <div className="space-y-6 sm:space-y-8">

                  {/* Schedule Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg font-medium">Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm sm:text-base text-gray-600">
                        Choose whether to publish the recipe immediately or schedule it for later.
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="publish-now"
                            name="schedule-type"
                            value="publish-now"
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                          />
                          <label htmlFor="publish-now" className="text-sm sm:text-base text-gray-700">
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
                          <label htmlFor="schedule-later" className="text-sm sm:text-base text-gray-700">
                            Schedule for later
                          </label>
                        </div>
                      </div>

                      {/* Date inputs - shown when "Schedule for later" is selected */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Start Date</label>
                            <Input 
                              type="date" 
                              defaultValue="2023-12-11"
                              className="h-10 sm:h-12 mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">End Date</label>
                            <Input 
                              type="date" 
                              placeholder="Select date"
                              className="h-10 sm:h-12 mt-1"
                            />
                          </div>
                        </div>
                        
                        {/* Information box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
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
                      <CardTitle className="text-base sm:text-lg font-medium">Audience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm sm:text-base text-gray-600">
                        Define who will see this. You can target specific audiences or label-based segments.
                      </div>

                      {/* Your Audiences Subsection */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900">Your Audiences</h4>
                          <Info className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-3">
                          <Select defaultValue="include">
                            <SelectTrigger className="w-24 h-10 sm:h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="include">Include</SelectItem>
                              <SelectItem value="exclude">Exclude</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-gray-600">users who are in the selected audience will be targeted</span>
                          <Select>
                            <SelectTrigger className="flex-1 h-10 sm:h-12">
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
                          <h4 className="text-sm sm:text-base font-medium text-gray-900">Filter by Labels</h4>
                          <Info className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-3">
                          <Select defaultValue="include">
                            <SelectTrigger className="w-24 h-10 sm:h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="include">Include</SelectItem>
                              <SelectItem value="exclude">Exclude</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-gray-600">users who are in the label will be targeted</span>
                          <Button variant="outline" size="sm" className="h-10 sm:h-12">
                            <span className="mr-2">+</span>
                            Add a label
                          </Button>
                        </div>
                      </div>

                      {/* Condition Logic */}
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-700">AND</span>
                      </div>
                      
                      <Button variant="outline" size="sm" className="h-10 sm:h-12">
                        <span className="mr-2">+</span>
                        New Condition
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 4: Placement Assignment */}
              {currentStep === 4 && (
                <div className="space-y-6 sm:space-y-8">

                  <FormField
                    control={form.control}
                    name="placementId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base font-medium">Placement Location</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                              <SelectValue placeholder="Select placement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {placements.map((placement) => (
                              <SelectItem
                                key={placement.id}
                                value={placement.id.toString()}
                              >
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{placement.name}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {placement.platform}
                                  </Badge>
                                </div>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base font-medium">Recipe Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Summer Sale Campaign"
                            className="h-10 sm:h-12 text-sm sm:text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 5: Preview & Launch */}
              {currentStep === 5 && (
                <div className="space-y-6 sm:space-y-8">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                        Recipe Flow Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-semibold flex-shrink-0">
                            1
                          </div>
                          <div>
                            <div className="font-semibold text-base sm:text-lg">
                              Template:{" "}
                              {
                                templateOptions.find(
                                  (t) => t.value === form.watch("template")
                                )?.label
                              }
                            </div>
                            <div className="text-sm sm:text-base text-gray-600">
                              Flow:{" "}
                              {templateOptions
                                .find((t) => t.value === form.watch("template"))
                                ?.flow.join(" → ")}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-semibold flex-shrink-0">
                            2
                          </div>
                          <div>
                            <div className="font-semibold text-base sm:text-lg">
                              Product Collection:{" "}
                              {selectedCollection ? "Selected" : "Not Selected"}
                            </div>
                            {selectedCollection && (
                              <div className="text-sm sm:text-base text-gray-600">
                                Collection:{" "}
                                {sampleCollections.find(c => c.id === selectedCollection)?.name || "Not configured"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-semibold flex-shrink-0">
                            3
                          </div>
                          <div>
                            <div className="font-semibold text-base sm:text-lg">
                              AI Personalization:{" "}
                              {form.watch("aiPersonalization")
                                ? "Enabled"
                                : "Disabled"}
                            </div>
                            <div className="text-sm sm:text-base text-gray-600">
                              {form.watch("aiPersonalization")
                                ? "Content will be personalized based on user behavior"
                                : "Static content will be shown"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-semibold flex-shrink-0">
                            4
                          </div>
                          <div>
                            <div className="font-semibold text-base sm:text-lg">
                              Conditions:{" "}
                              {form.watch("conditions") && form.watch("conditions").length > 0
                                ? "Configured"
                                : "Not Configured"}
                            </div>
                            <div className="text-sm sm:text-base text-gray-600">
                              {form.watch("conditions") && form.watch("conditions").length > 0
                                ? `${form.watch("conditions").length} condition(s) set`
                                : "No additional conditions defined"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-semibold flex-shrink-0">
                            5
                          </div>
                          <div>
                            <div className="font-semibold text-base sm:text-lg">
                              Schedule:{" "}
                              Publish Now
                            </div>
                            <div className="text-sm sm:text-base text-gray-600">
                              Recipe will be published immediately
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-semibold flex-shrink-0">
                            6
                          </div>
                          <div>
                            <div className="font-semibold text-base sm:text-lg">
                              Audience:{" "}
                              All Users
                            </div>
                            <div className="text-sm sm:text-base text-gray-600">
                              Targeting all users (no specific segments)
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-semibold flex-shrink-0">
                            7
                          </div>
                          <div>
                            <div className="font-semibold text-base sm:text-lg">
                              Placement:{" "}
                              {placements.find(p => p.id === form.watch("placementId"))?.name || "Not Selected"}
                            </div>
                            <div className="text-sm sm:text-base text-gray-600">
                              {placements.find(p => p.id === form.watch("placementId"))?.platform || "Platform not specified"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base font-medium">Launch Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Save as Draft</SelectItem>
                            <SelectItem value="testing">
                              Launch for Testing
                            </SelectItem>
                            <SelectItem value="active">Launch Live</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                        AI Configuration Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Recipe Flow Chart */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-4">Recipe Flow Chart</h4>
                          
                          {/* Start Node */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                              <span className="font-medium">Start Recipe</span>
                            </div>
                          </div>

                          {/* Template Selection */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                              <div className="font-medium">Template: {templateOptions.find(t => t.value === form.watch("template"))?.label || "Not Selected"}</div>
                              <div className="text-xs opacity-90">Flow: {templateOptions.find(t => t.value === form.watch("template"))?.flow?.join(" → ") || "Not configured"}</div>
                            </div>
                          </div>

                          {/* Product Collection */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-purple-500 text-white px-4 py-2 rounded-lg">
                              <div className="font-medium">Product Collection</div>
                              <div className="text-xs opacity-90">
                                {selectedCollection 
                                  ? sampleCollections.find(c => c.id === selectedCollection)?.name || "Selected"
                                  : "Not Selected"
                                }
                              </div>
                            </div>
                          </div>

                          {/* AI Personalization Decision */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                              <div className="font-medium">AI Personalization</div>
                              <div className="text-xs opacity-90">
                                {form.watch("aiPersonalization") ? "Enabled" : "Disabled"}
                              </div>
                            </div>
                          </div>

                          {/* Conditions Check */}
                          {form.watch("conditions") && form.watch("conditions").length > 0 && (
                            <div className="flex items-center justify-center mb-4">
                              <div className="bg-red-500 text-white px-4 py-2 rounded-lg">
                                <div className="font-medium">Conditions Check</div>
                                <div className="text-xs opacity-90">
                                  {form.watch("conditions").length} condition(s) configured
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Schedule */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-indigo-500 text-white px-4 py-2 rounded-lg">
                              <div className="font-medium">Schedule</div>
                              <div className="text-xs opacity-90">Publish Now</div>
                            </div>
                          </div>

                          {/* Audience Targeting */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-teal-500 text-white px-4 py-2 rounded-lg">
                              <div className="font-medium">Audience Targeting</div>
                              <div className="text-xs opacity-90">All Users</div>
                            </div>
                          </div>

                          {/* Placement */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                              <div className="font-medium">Placement</div>
                              <div className="text-xs opacity-90">
                                {placements.find(p => p.id === form.watch("placementId"))?.name || "Not Selected"}
                              </div>
                            </div>
                          </div>

                          {/* User Interaction Flow */}
                          <div className="border-t-2 border-gray-300 pt-4 mt-6">
                            <h5 className="font-semibold text-gray-900 mb-3 text-center">User Interaction Flow</h5>
                            
                            {/* User Sees Content */}
                            <div className="flex items-center justify-center mb-3">
                              <div className="bg-gray-600 text-white px-4 py-2 rounded-lg">
                                <div className="font-medium">User Sees Content</div>
                                <div className="text-xs opacity-90">Based on placement & audience</div>
                              </div>
                            </div>

                            {/* Decision Diamond */}
                            <div className="flex items-center justify-center mb-3">
                              <div className="bg-yellow-500 text-white px-4 py-2 transform rotate-45 w-16 h-16 flex items-center justify-center">
                                <div className="transform -rotate-45 text-center">
                                  <div className="text-xs font-medium">User</div>
                                  <div className="text-xs">Engages?</div>
                                </div>
                              </div>
                            </div>

                            {/* Engagement Paths */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center">
                                <div className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm">
                                  <div className="font-medium">Yes</div>
                                  <div className="text-xs">Shows personalized content</div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm">
                                  <div className="font-medium">No</div>
                                  <div className="text-xs">Shows default content</div>
                                </div>
                              </div>
                            </div>

                            {/* AI Personalization Impact */}
                            {form.watch("aiPersonalization") && (
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-center mb-3">
                                <div className="font-medium">AI Personalization Active</div>
                                <div className="text-xs opacity-90">Content adapts based on user behavior</div>
                              </div>
                            )}

                            {/* Conditions Impact */}
                            {form.watch("conditions") && form.watch("conditions").length > 0 && (
                              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-center">
                                <div className="font-medium">Conditions Monitoring</div>
                                <div className="text-xs opacity-90">Recipe behavior changes based on conditions</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Configuration Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div><strong>Template:</strong> {templateOptions.find(t => t.value === form.watch("template"))?.label || "Not Selected"}</div>
                            <div><strong>Collection:</strong> {selectedCollection ? sampleCollections.find(c => c.id === selectedCollection)?.name : "Not Selected"}</div>
                            <div><strong>AI Personalization:</strong> {form.watch("aiPersonalization") ? "Enabled" : "Disabled"}</div>
                            <div><strong>Conditions:</strong> {form.watch("conditions")?.length || 0} configured</div>
                          </div>
                          <div className="space-y-2">
                            <div><strong>Schedule:</strong> Publish Now</div>
                            <div><strong>Audience:</strong> All Users</div>
                            <div><strong>Placement:</strong> {placements.find(p => p.id === form.watch("placementId"))?.name || "Not Selected"}</div>
                            <div><strong>Status:</strong> Ready to Launch</div>
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
    </div>
  );
}

// Add helper to get personalizationDefaults for selected template
function getPersonalizationDefaults(template: string) {
  for (const cat of recipeCategories) {
    if (!cat.templates) continue;
    for (const sub of cat.templates) {
      if (sub.templates && Array.isArray(sub.templates)) {
        // sub is a subcategory
        const found = sub.templates.find((t: any) => t.id === template);
        if (found && found.personalizationDefaults)
          return found.personalizationDefaults;
      }
    }
  }
  return null;
}
