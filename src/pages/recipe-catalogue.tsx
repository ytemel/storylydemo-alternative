import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RecipeCreator from "@/components/recipe-creator";
import {
  Target,
  ArrowRight,
  Wand2,
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
            description: "Display a Canvas widget on the homepage showcasing each shopper's 10 most recently searched products. Tapping an item opens a Video Feed with engaging, shoppable clips of that product and similar alternatives—reviving high-intent items and streamlining the path to purchase.",
            flow: ["Canvas", "Video Feed"],
            personalizationDefaults: {
              goal: "Revive high-intent searches through personalized video content",
              logic: "Show recent searches in canvas, then video feed for product discovery",
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


// Color mapping for subcategories
const getSubcategoryColor = (subcategoryId: string) => {
  const colorMap: Record<string, string> = {
    "complete-the-look-experiences": "bg-blue-50 text-blue-700",
    "build-wishlist": "bg-purple-50 text-purple-700", 
    "improve-product-campaign-discovery": "bg-green-50 text-green-700",
    "create-sense-of-urgency": "bg-orange-50 text-orange-700",
    "reward-customers": "bg-pink-50 text-pink-700",
    "use-loyalty-status-drive-sales": "bg-cyan-50 text-cyan-700",
    "widgets-only-picker": "bg-gray-50 text-gray-700"
  };
  return colorMap[subcategoryId] || "bg-gray-50 text-gray-700";
};

export default function RecipeCatalogue() {
  const [showCreator, setShowCreator] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const handleCloseCreator = () => {
    setShowCreator(false);
    setSelectedSubCategory("");
    setSelectedTemplate("");
  };


  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recipe Catalogue</h1>
            <p className="text-muted-foreground">
              Choose a recipe template to create your campaign
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Recipe Categories */}
        <div className="mb-8">


          <div className="space-y-8">
            {recipeCategories.map((category) => {
              // Flatten all templates from all subcategories within this category
              const allTemplatesInCategory = category.templates
                .filter((sub: any) => Array.isArray(sub.templates))
                .flatMap((sub: any) => 
                  sub.templates.map((template: any) => ({
                    ...template,
                    subcategoryName: sub.name,
                    subcategoryId: sub.id
                  }))
                );

              return (
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
                  </div>

                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                    {allTemplatesInCategory.map((template: any) => {
                      return (
                        <Card
                          key={template.id}
                          className="recipe-card cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0"
                          style={{ width: '320px', minWidth: '320px' }}
                          onClick={() => {
                            console.log("Clicked template:", template.id);
                            setSelectedSubCategory(template.subcategoryId);
                            setSelectedTemplate(template.id);
                            setShowCreator(true);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="mb-3">
                              {/* Subcategory badge */}
                              <Badge
                                variant="secondary"
                                className={`mb-2 text-xs hover:opacity-80 ${getSubcategoryColor(template.subcategoryId)}`}
                              >
                                {template.subcategoryName}
                              </Badge>
                              
                              {/* Template name */}
                              <h3 className="text-base font-semibold text-foreground mb-2 leading-tight">
                                {template.name}
                              </h3>
                              
                              {/* Brief description */}
                              <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                                {template.description.length > 100 
                                  ? template.description.substring(0, 100) + '...' 
                                  : template.description
                                }
                              </p>
                            </div>
                            
                            {/* Widget flow */}
                            {template.flow && template.flow.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                {template.flow.map((widget: string, index: number) => (
                                  <div key={index} className="flex items-center gap-1">
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      {widget}
                                    </span>
                                    {index < template.flow.length - 1 && (
                                      <ArrowRight className="w-3 h-3 text-gray-400" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <RecipeCreator
        open={showCreator}
        onClose={handleCloseCreator}
        selectedSubCategory={selectedSubCategory || ""}
        selectedTemplate={selectedTemplate || ""}
      />
    </div>
  );
}
