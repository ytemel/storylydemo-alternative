import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RecipeCreator from "@/components/recipe-creator";
import {
  Plus,
  Edit,
  Trash2,
  Wand2,
  Target,
  Rocket,
  ShoppingBasket,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import type { Recipe } from "@/shared/schema";
import { getEligibleWidgetsForWidgetsOnly } from "@/lib/widget-definitions";

// TypeScript types for the recipe hierarchy
export interface RecipeTemplate {
  id: string;
  name: string;
  description: string;
  flow: string[];
  personalizationDefaults: any;
}

export interface RecipeSubCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  templates: RecipeTemplate[];
}

export interface RecipeCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  templates: RecipeSubCategory[];
}

export const recipeCategories: RecipeCategory[] = [
  {
    id: "basket-booster-size",
    name: "Basket Booster Size",
    description: "Increase basket size and average order value",
    count: 1,
    templates: [
      {
        id: "complete-the-look-experiences",
        name: "Complete the Look Experiences",
        description: "Encourage additional purchases with complementary products",
        icon: Target,
        templates: [
          {
            id: "ugc-canvas-complete-look",
            name: "UGC Canvas Complete Look",
            description: "Use a Canvas widget to showcase curated UGC that features the item styled in complete looks. Shoppers see how the product fits into real-life outfits, with direct links to complementary items. Each tile lets users instantly add related products to their cart or wishlist, helping increase basket size and attachment rate.",
            flow: ["Canvas"],
            personalizationDefaults: {
              goal: "Increase basket size through UGC-inspired complete looks",
              logic: "Show curated UGC content with complementary product recommendations",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "ugc_engagement",
                    operator: "greater_than",
                    value: "50",
                  },
                  {
                    field: "basket_size",
                    operator: "less_than",
                    value: "3",
                  },
                ],
                or: false,
              },
            },
          },
          {
            id: "add-to-cart-canvas-upsell",
            name: "Add to Cart Canvas Upsell",
            description: "When a shopper taps Add to Cart, trigger a Canvas that highlights complementary and frequently bought together items. Auto-populate the Canvas using product feed data ranked by co-purchase affinity, category fit, margin, and availability. Include clear multi-item incentives to encourage upsell and help users complete their purchase faster.",
            flow: ["Canvas"],
            personalizationDefaults: {
              goal: "Drive upsell through intelligent complementary product recommendations",
              logic: "Trigger canvas with co-purchase recommendations when user adds to cart",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "cart_value",
                    operator: "greater_than",
                    value: "25",
                  },
                  {
                    field: "co_purchase_affinity",
                    operator: "greater_than",
                    value: "70",
                  },
                ],
                or: true,
              },
            },
          },
          {
            id: "post-purchase-canvas-complete-look",
            name: "Post-Purchase Canvas Complete Look",
            description: "Replace the standard \"Thank you\" page with a shoppable Canvas that showcases perfectly matched add-ons—such as accessories, styling items, or refill essentials—for the product just purchased. Use the content personalization engine to identify customers who completed a purchase and dynamically display \"Complete the Look\" recommendations in the post-purchase Canvas. Include clear calls-to-action and consider adding a time-sensitive discount to encourage immediate follow-up purchases.",
            flow: ["Canvas"],
            personalizationDefaults: {
                              goal: "Drive post-purchase upsell through personalized \"Complete the Look\" recommendations",
              logic: "Show personalized add-on recommendations immediately after purchase completion",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "purchase_completed",
                    operator: "equals",
                    value: "true",
                  },
                  {
                    field: "post_purchase_engagement",
                    operator: "less_than",
                    value: "24",
                  },
                ],
                or: false,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: "product-discovery",
    name: "Product Discovery",
    description: "Help users discover new products and collections",
    count: 2,
    templates: [
      {
        id: "build-wishlist",
        name: "Build Wishlist",
        description: "Encourage users to add products to their wishlist",
        icon: Target,
        templates: [
          {
            id: "swipe-card-wishlist",
            name: "Swipe Card Wishlist Builder",
            description: "Use a Swipe Card widget to let users build their wishlists by swiping right to save and left to skip. Populate it with products from your feed and personalise the experience using in-app behaviour like recently viewed items to show the most relevant options.",
            flow: ["Swipe Card"],
            personalizationDefaults: {
              goal: "Build user wishlists through interactive swipe experience",
              logic: "Show personalized swipe cards based on user behavior and preferences",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "recently_viewed",
                    operator: "greater_than",
                    value: "5",
                  },
                  {
                    field: "wishlist_items",
                    operator: "less_than",
                    value: "10",
                  },
                ],
                or: false,
              },
            },
          },
          {
            id: "countdown-banner-story-wishlist",
            name: "Countdown Banner & Story Wishlist",
            description: "Add a Countdown Banner to your homepage to build urgency ahead of a major sale. When tapped, the banner opens a Story Group featuring curated product highlights and direct actions. Users can favourite or add items to their cart directly from Stories, making it easy to plan purchases in advance and boost conversion when the sale starts.",
            flow: ["Banner", "Story"],
            personalizationDefaults: {
              goal: "Build wishlist engagement through countdown urgency and story discovery",
              logic: "Show countdown banner to create urgency, then story content for product discovery",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "sale_interest",
                    operator: "greater_than",
                    value: "70",
                  },
                  {
                    field: "wishlist_items",
                    operator: "less_than",
                    value: "10",
                  },
                ],
                or: false,
              },
            },
          },
        ],
      },
      {
        id: "improve-product-campaign-discovery",
        name: "Improve Product/Campaign Discovery",
        description: "Enhance product and campaign visibility to drive engagement",
        icon: Target,
        templates: [
          {
            id: "trending-near-you-banner-stories",
            name: "Trending Near You Banner & Stories",
            description: "Add a dynamic Banner to category pages highlighting \"Trending Near You\" or \"Trending in Your Circle\" based on location, behaviour, or demographics. The Banner updates in real time using sales data to surface popular products. When tapped, it opens a Story Group that turns social proof into personalised product discovery.",
            flow: ["Banner", "Story"],
            personalizationDefaults: {
              goal: "Drive product discovery through location and behavior-based trending recommendations",
              logic: "Show dynamic banner with trending products based on user location and behavior",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "location_data",
                    operator: "exists",
                    value: "",
                  },
                  {
                    field: "category_page_visit",
                    operator: "greater_than",
                    value: "2",
                  },
                ],
                or: false,
              },
            },
          },
          {
            id: "recent-searches-canvas-feed",
            name: "Recent Searches Canvas & Feed",
            description: "Display a Canvas widget on the homepage showcasing each shopper's 10 most recently searched products. Tapping an item opens a Vertical Video Feed with engaging, shoppable clips of that product and similar alternatives—reviving high-intent items and streamlining the path to purchase.",
            flow: ["Canvas", "Vertical Feed"],
            personalizationDefaults: {
              goal: "Revive high-intent searches through personalized video content",
              logic: "Show recent searches in canvas, then vertical video feed for product discovery",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "recent_searches",
                    operator: "greater_than",
                    value: "3",
                  },
                  {
                    field: "search_to_purchase_rate",
                    operator: "less_than",
                    value: "30",
                  },
                ],
                or: false,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: "conversion",
    name: "Conversion",
    description: "Drive conversions and sales with urgency and optimization",
    count: 1,
    templates: [
      {
        id: "create-sense-of-urgency",
        name: "Create a Sense of Urgency for Campaigns",
        description: "Drive immediate action with time-sensitive campaigns",
        icon: Target,
        templates: [
          {
            id: "excess-inventory-banner-stories",
            name: "Excess Inventory Banner & Stories",
            description: "Launch a limited-time campaign to promote excess inventory by placing a Banner widget on the homepage with a countdown timer to drive urgency. Use a clear CTA like \"Shop the Deals\" that opens Shoppable Stories populated from a dedicated excess-stock product feed. Stories automatically display product tags, swipe-ups, buttons, and product cards, allowing shoppers to explore variants and add items to cart directly within the Story experience.",
            flow: ["Banner", "Story"],
            personalizationDefaults: {
              goal: "Drive urgency and sales for excess inventory through limited-time campaigns",
              logic: "Show countdown banner with clear CTA that opens shoppable stories for excess stock",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "inventory_level",
                    operator: "greater_than",
                    value: "100",
                  },
                  {
                    field: "session_duration",
                    operator: "greater_than",
                    value: "30",
                  },
                ],
                or: false,
              },
            },
          },
          {
            id: "power-hour-countdown-stories",
            name: "Power Hour Countdown & Stories",
            description: "Trigger a 60-minute Power Hour during peak traffic by auto-scheduling a Countdown Banner that appears when the session begins. Each tap opens Shoppable Stories featuring limited-stock, high-discount items. Once the timer ends, the widget disappears—driving urgency, exclusivity, and encouraging users to return for future drops.",
            flow: ["Banner", "Story"],
            personalizationDefaults: {
              goal: "Create exclusive urgency through time-limited Power Hour campaigns",
              logic: "Auto-schedule countdown banner for peak traffic with limited-stock stories",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "peak_traffic_hour",
                    operator: "equals",
                    value: "true",
                  },
                  {
                    field: "limited_stock_items",
                    operator: "greater_than",
                    value: "5",
                  },
                ],
                or: false,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: "customer-retention",
    name: "Customer Retention",
    description:
      "Increase customer lifetime value with personalized experiences",
    count: 2,
    templates: [
      {
        id: "reward-customers",
        name: "Reward Customers",
        description: "Reward loyal customers with exclusive experiences and incentives",
        icon: Target,
        templates: [
          {
            id: "vip-early-access-banner-stories",
            name: "VIP Early Access Banner & Stories",
            description: "Display a VIP-only Banner on the homepage 2–3 days ahead of your major sale, targeting high-value segments based on criteria like spend history or loyalty tier. The banner unlocks access to exclusive Shoppable Stories featuring curated deals. Personalise content using behavioural data to deliver a sense of exclusivity, reward loyalty, and drive early conversions while easing peak-time demand.",
            flow: ["Banner", "Story"],
            personalizationDefaults: {
              goal: "Reward VIP customers with exclusive early access to drive loyalty and early conversions",
              logic: "Show VIP-only banner with exclusive stories for high-value customers ahead of sales",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "loyalty_tier",
                    operator: "equals",
                    value: "VIP",
                  },
                  {
                    field: "spend_history",
                    operator: "greater_than",
                    value: "500",
                  },
                ],
                or: false,
              },
            },
          },
          {
            id: "mystery-discount-countdown-stories",
            name: "Mystery Discount Countdown & Stories",
            description: "Place a Countdown Banner at the top of your homepage to reveal a new digit of a mystery discount code each day for a week. Tapping the Banner opens a Story that unveils the day's digit, followed by curated product Stories to spark discovery. This gamified experience drives daily engagement, encourages repeat visits, and builds anticipation, ultimately rewarding loyal users with an exclusive discount during the sale.",
            flow: ["Banner", "Story"],
            personalizationDefaults: {
              goal: "Drive daily engagement and build anticipation through gamified discount reveal",
              logic: "Show countdown banner with daily digit reveal and curated product stories",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "daily_visits",
                    operator: "greater_than",
                    value: "3",
                  },
                  {
                    field: "loyalty_score",
                    operator: "greater_than",
                    value: "70",
                  },
                ],
                or: false,
              },
            },
          },
        ],
      },
      {
        id: "use-loyalty-status-drive-sales",
        name: "Use Loyalty Status to Drive Sales",
        description: "Leverage loyalty tiers to motivate purchases and drive conversions",
        icon: Target,
        templates: [
          {
            id: "loyalty-tier-booster-story",
            name: "Loyalty Tier Booster Story",
            description: "Display a floating Story or auto-launch a personalized Story when a logged-in shopper visits a product detail page. Highlight their current loyalty tier, how close they are to the next level, and offer a limited-time booster (e.g., double points). Add a direct \"Add to Cart\" CTA to convert loyalty motivation into immediate action.",
            flow: ["Story"],
            personalizationDefaults: {
              goal: "Drive conversions by leveraging loyalty status and tier progression",
              logic: "Show personalized story highlighting loyalty tier and offering boosters to motivate purchase",
              configuration: {
                smartSorting: true,
                conditions: [
                  {
                    field: "loyalty_tier",
                    operator: "not_equals",
                    value: "Bronze",
                  },
                  {
                    field: "points_to_next_tier",
                    operator: "less_than",
                    value: "100",
                  },
                ],
                or: false,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: "widgets-only",
    name: "Widgets Only",
    description: "Create recipes that contain only widgets with no extra logic",
    count: 0,
    templates: [
      {
        id: "widgets-only-picker",
        name: "Pick Widgets",
        description: "Choose a widget type to add instantly—no extra setup needed",
        icon: Wand2,
        templates: getEligibleWidgetsForWidgetsOnly().map((w) => ({
          id: w.id,
          name: w.name,
          description: `Add a ${w.name} to your page in seconds` ,
          flow: [w.name],
          personalizationDefaults: {
            goal: `Use ${w.name} widget`,
            logic: "No additional logic",
            configuration: {},
          },
        })),
      },
    ],
  },
];

const allTemplates = recipeCategories.flatMap((category) => category.templates);

export default function Recipes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/recipes`, undefined, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      toast({
        title: "Recipe deleted",
        description: "The recipe has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error deleting recipe",
        description:
          "There was an error deleting the recipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowCreator(true);
  };

  const handleDeleteRecipe = (id: number) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseCreator = () => {
    setShowCreator(false);
    setSelectedRecipe(undefined);
    setSelectedSubCategory("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "testing":
        return "bg-yellow-500";
      case "draft":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recipes</h1>
            <p className="text-muted-foreground">
              AI-powered campaign flows and automation
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Recipe Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              AI Recipe Studio
            </h2>
          </div>

          <div className="space-y-8">
            {recipeCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800"
                  >
                    {category.count} recipes
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {category.templates
                    .filter((sub: any) => Array.isArray(sub.templates))
                    .map((sub: any) => {
                      const Icon = sub.icon;
                      // Debug log
                      console.log(
                        "Rendering sub category card:",
                        sub.id,
                        sub.name
                      );
                      return (
                        <Card
                          key={sub.id}
                          className="recipe-card cursor-pointer"
                          onClick={() => {
                            console.log("Clicked sub category:", sub.id);
                            setSelectedSubCategory(sub.id);
                            setShowCreator(true);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="mb-4">
                              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-2">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <h3 className="text-base font-semibold text-foreground">
                                {sub.name}
                              </h3>
                              <p className="text-muted-foreground text-xs">
                                {sub.description}
                              </p>
                            </div>
                            {/* Metrics Section - only show metric names, no values */}
                            <div className="flex flex-col gap-1 mt-2">
                              {sub.id === "build-wishlist" ? (
                                <>
                                  <span className="text-xs text-gray-500">
                                    Add-to-wishlist rate
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Product detail page visits
                                  </span>
                                </>
                              ) : sub.id === "improve-product-campaign-discovery" ? (
                                <>
                                  <span className="text-xs text-gray-500">
                                    CTR
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Add to Cart Rate
                                  </span>
                                </>
                              ) : sub.id === "create-sense-of-urgency" ? (
                                <>
                                  <span className="text-xs text-gray-500">
                                    Add to Cart Rate
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Conversion Rate
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Units Sold
                                  </span>
                                </>
                              ) : sub.id === "complete-the-look-experiences" ? (
                                <>
                                  <span className="text-xs text-gray-500">
                                    Add to Cart Rate
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Add to Wishlist Rate
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    AOV
                                  </span>
                                </>
                              ) : sub.id === "reward-customers" ? (
                                <>
                                  <span className="text-xs text-gray-500">
                                    CTR
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Weekly Retention Rate
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Impressions
                                  </span>
                                </>
                              ) : sub.id === "use-loyalty-status-drive-sales" ? (
                                <>
                                  <span className="text-xs text-gray-500">
                                    Loyalty Status Upgrade Rate
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Conversion Rate per Loyalty Status
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-xs text-gray-500">
                                    Conversion Rate
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Impressions
                                  </span>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Recipes */}
        <Card>
          <CardHeader>
            <CardTitle>Your Active Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse">Loading recipes...</div>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No recipes created yet</p>
                <Button onClick={() => setShowCreator(true)}>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Create Your First Recipe
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Wand2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {recipe.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {recipe.goal.replace("-", " ")} •{" "}
                            {recipe.performance?.conversionRate?.toFixed(1)}%
                            conversion
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            recipe.status === "active" ? "default" : "secondary"
                          }
                          className={
                            recipe.status === "active" ? "bg-green-500" : ""
                          }
                        >
                          {recipe.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRecipe(recipe)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Recipe Flow Visualization */}
                    <div className="flex items-center space-x-4 text-sm">
                      {recipe.workflow?.steps?.map((step, index) => (
                        <div
                          key={step.id}
                          className="flex items-center space-x-2"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-6 h-6 ${getStatusColor(
                                recipe.status ?? ""
                              )} rounded flex items-center justify-center`}
                            >
                              <Wand2 className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-muted-foreground">
                              {step.type.replace("-", " ")}
                            </span>
                          </div>
                          {index <
                            (recipe.workflow?.steps?.length ?? 0) - 1 && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RecipeCreator
        open={showCreator}
        onClose={handleCloseCreator}
        selectedSubCategory={selectedSubCategory || ""}
      />
    </div>
  );
}
