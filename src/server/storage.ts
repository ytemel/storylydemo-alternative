import {
  type User,
  type InsertUser,
  type Widget,
  type InsertWidget,
  type Recipe,
  type InsertRecipe,
  type Placement,
  type InsertPlacement,
  type AudienceSegment,
  type InsertAudienceSegment,
  type Analytics,
  type InsertAnalytics,
} from "@/shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Widget methods
  getWidgets(): Promise<Widget[]>;
  getWidget(id: number): Promise<Widget | undefined>;
  createWidget(widget: InsertWidget): Promise<Widget>;
  updateWidget(id: number, widget: Partial<InsertWidget>): Promise<Widget>;
  deleteWidget(id: number): Promise<void>;

  // Recipe methods
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;

  // Placement methods
  getPlacements(): Promise<Placement[]>;
  getPlacement(id: number): Promise<Placement | undefined>;
  createPlacement(placement: InsertPlacement): Promise<Placement>;
  updatePlacement(
    id: number,
    placement: Partial<InsertPlacement>
  ): Promise<Placement>;
  deletePlacement(id: number): Promise<void>;

  // Audience segment methods
  getAudienceSegments(): Promise<AudienceSegment[]>;
  getAudienceSegment(id: number): Promise<AudienceSegment | undefined>;
  createAudienceSegment(
    segment: InsertAudienceSegment
  ): Promise<AudienceSegment>;
  updateAudienceSegment(
    id: number,
    segment: Partial<InsertAudienceSegment>
  ): Promise<AudienceSegment>;
  deleteAudienceSegment(id: number): Promise<void>;

  // Analytics methods
  getAnalytics(entityType?: string, entityId?: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private widgets: Map<number, Widget>;
  private recipes: Map<number, Recipe>;
  private placements: Map<number, Placement>;
  private audienceSegments: Map<number, AudienceSegment>;
  private analytics: Map<number, Analytics>;
  private currentUserId: number;
  private currentWidgetId: number;
  private currentRecipeId: number;
  private currentPlacementId: number;
  private currentSegmentId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.widgets = new Map();
    this.recipes = new Map();
    this.placements = new Map();
    this.audienceSegments = new Map();
    this.analytics = new Map();
    this.currentUserId = 1;
    this.currentWidgetId = 1;
    this.currentRecipeId = 1;
    this.currentPlacementId = 1;
    this.currentSegmentId = 1;
    this.currentAnalyticsId = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample placements
    const placement1 = {
      id: this.currentPlacementId++,
      name: "Homepage Hero",
      platform: "android",
      sdkToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      widgetId: null,
      createdAt: new Date(),
    } as Placement;

    const placement2 = {
      id: this.currentPlacementId++,
      name: "Product Page",
      platform: "android",
      sdkToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      widgetId: null,
      createdAt: new Date(),
    } as Placement;

    this.placements.set(placement1.id, placement1);
    this.placements.set(placement2.id, placement2);

    // Sample widgets
    const widget1 = {
      id: this.currentWidgetId++,
      name: "Summer Sale Banner",
      type: "banner",
      content: {
        title: "Summer Sale",
        description: "Get 50% off on all summer items",
        buttonText: "Shop Now",
        destinationUrl: "/summer-sale",
      },
      style: {
        backgroundColor: "#6B46C1",
        textColor: "#FFFFFF",
        layout: "center",
        fontSize: "18px",
      },
      placementId: placement1.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const widget2 = {
      id: this.currentWidgetId++,
      name: "Product Story Bar",
      type: "story-bar",
      content: {
        title: "New Collection",
        description: "Discover our latest products",
      },
      style: {
        backgroundColor: "#10B981",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement2.id,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    // Sample Recipe Widgets for testing recipe creation
    const recipeWidget1 = {
      id: this.currentWidgetId++,
      name: "Product Story Bar",
      type: "story-bar",
      isRecipeWidget: true,
      content: {
        title: "Product Stories",
        description: "Interactive product showcases",
      },
      style: {
        backgroundColor: "#8B5CF6",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;



    const recipeWidget3 = {
      id: this.currentWidgetId++,
      name: "Product Swipe Cards",
      type: "swipe-card",
      isRecipeWidget: true,
      parentRecipeId: null,
      placementId: null,
      content: {
        title: "Interactive Products",
        description: "Swipe to explore products",
        collection: "Summer collection 2025",
        audience: "New subscribers",
      },
      style: {
        backgroundColor: "#8B5CF6",
        textColor: "#FFFFFF",
        layout: "vertical",
        fontSize: "16px",
      },
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const recipeWidget4 = {
      id: this.currentWidgetId++,
      name: "Product Banner",
      type: "banner",
      isRecipeWidget: true,
      content: {
        title: "Special Offer",
        description: "Limited time deals",
        buttonText: "Shop now",
      },
      style: {
        backgroundColor: "#F59E0B",
        textColor: "#FFFFFF",
        layout: "center",
        fontSize: "18px",
      },
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    // Add recipe widgets to storage
    this.widgets.set(recipeWidget1.id, recipeWidget1);
    this.widgets.set(recipeWidget3.id, recipeWidget3);
    this.widgets.set(recipeWidget4.id, recipeWidget4);

    // Sample Standalone Widgets for Widget Library
    const widget3 = {
      id: this.currentWidgetId++,
      name: "Homepage Banner",
      type: "banner",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Big Sale is Coming",
        description: "Limited time offer",
        buttonText: "Shop now",
        destinationUrl: "/sale",
      },
      style: {
        backgroundColor: "#F59E0B",
        textColor: "#FFFFFF",
        layout: "center",
        fontSize: "18px",
      },
      placementId: placement1.id,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const widget4 = {
      id: this.currentWidgetId++,
      name: "Mobile Story Bar",
      type: "story-bar",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Product Stories",
        description: "Interactive product showcases",
      },
      style: {
        backgroundColor: "#8B5CF6",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement2.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;







    const widget8 = {
      id: this.currentWidgetId++,
      name: "Flash Sale Countdown",
      type: "countdown",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Flash Sale",
        description: "Limited time offer ending soon",
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      },
      style: {
        backgroundColor: "#EF4444",
        textColor: "#FFFFFF",
        layout: "center",
        fontSize: "18px",
      },
      placementId: placement2.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const widget9 = {
      id: this.currentWidgetId++,
      name: "Style Quiz",
      type: "quiz",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Find Your Style",
        description: "Take our style quiz",
        questions: [
          "What's your preferred color palette?",
          "How do you like to dress?",
          "What occasions do you shop for?"
        ]
      },
      style: {
        backgroundColor: "#F59E0B",
        textColor: "#FFFFFF",
        layout: "center",
        fontSize: "16px",
      },
      placementId: placement1.id,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const widget10 = {
      id: this.currentWidgetId++,
      name: "Product Video Feed",
      type: "video-feed",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Product Videos",
        description: "Watch product demonstrations",
      },
      style: {
        backgroundColor: "#3B82F6",
        textColor: "#FFFFFF",
        layout: "grid",
        fontSize: "16px",
      },
      placementId: placement2.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    // Add more swipe card widgets to match the design reference
    const swipeCard1 = {
      id: this.currentWidgetId++,
      name: "Summer sale recommendation",
      type: "swipe-card",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Summer Sale",
        description: "Live now",
        collection: "Summer collection 2025",
        audience: "New subscribers",
        slides: ["product1.jpg", "product2.jpg", "product3.jpg", "product4.jpg"],
      },
      style: {
        backgroundColor: "#10B981",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement1.id,
      status: "active",
      scheduledAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const swipeCard2 = {
      id: this.currentWidgetId++,
      name: "New summer collection",
      type: "swipe-card",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "New Collection",
        description: "Summer vibes",
        collection: "Summer collection 2025",
        audience: "No audience",
        slides: ["summer1.jpg", "summer2.jpg", "summer3.jpg", "summer4.jpg"],
      },
      style: {
        backgroundColor: "#8B5CF6",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement2.id,
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const swipeCard3 = {
      id: this.currentWidgetId++,
      name: "Summer sale",
      type: "swipe-card",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Summer Sale",
        description: "Live now - Ends 2026-09-30",
        collection: "Summer collection 2025",
        audience: "Holiday shoppers + Labels",
        slides: ["sale1.jpg", "sale2.jpg", "sale3.jpg", "sale4.jpg"],
      },
      style: {
        backgroundColor: "#F59E0B",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement1.id,
      status: "active",
      scheduledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const swipeCard4 = {
      id: this.currentWidgetId++,
      name: "Spring pro",
      type: "swipe-card",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Spring Collection",
        description: "Professional spring looks",
        collection: "Summer collection 2025",
        audience: "Labels",
        slides: ["spring1.jpg", "spring2.jpg", "spring3.jpg", "spring4.jpg"],
      },
      style: {
        backgroundColor: "#EC4899",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement2.id,
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const swipeCard5 = {
      id: this.currentWidgetId++,
      name: "Winter collection",
      type: "swipe-card",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Winter Collection",
        description: "Cozy winter styles",
        collection: "Summer collection 2025",
        audience: "No audience",
        slides: ["winter1.jpg", "winter2.jpg", "winter3.jpg", "winter4.jpg"],
      },
      style: {
        backgroundColor: "#6B7280",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement1.id,
      status: "inactive",
      scheduledAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next month
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    // Add standalone widgets to storage
    this.widgets.set(widget3.id, widget3);
    this.widgets.set(widget4.id, widget4);
    this.widgets.set(widget8.id, widget8);
    this.widgets.set(widget9.id, widget9);
    this.widgets.set(widget10.id, widget10);
    
    // Add swipe card widgets to storage
    this.widgets.set(swipeCard1.id, swipeCard1);
    this.widgets.set(swipeCard2.id, swipeCard2);
    this.widgets.set(swipeCard3.id, swipeCard3);
    this.widgets.set(swipeCard4.id, swipeCard4);
    this.widgets.set(swipeCard5.id, swipeCard5);

    // Add more banner widgets to match the design reference
    const banner1 = {
      id: this.currentWidgetId++,
      name: "yt1",
      type: "banner",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Banner yt1",
        description: "Promotional banner content",
        buttonText: "Learn More",
        audience: "None",
        imageUrl: "banner1.jpg",
      },
      style: {
        backgroundColor: "#6366F1",
        textColor: "#FFFFFF",
        layout: "center",
        fontSize: "18px",
      },
      placementId: placement1.id,
      status: "active",
      scheduledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const banner2 = {
      id: this.currentWidgetId++,
      name: "yt2",
      type: "banner",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Banner yt2",
        description: "Secondary banner content", 
        buttonText: "Shop Now",
        audience: "None",
        imageUrl: "banner2.jpg",
      },
      style: {
        backgroundColor: "#8B5CF6",
        textColor: "#FFFFFF",
        layout: "center",
        fontSize: "18px",
      },
      placementId: placement2.id,
      status: "active",
      scheduledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    // Add banner widgets to storage
    this.widgets.set(banner1.id, banner1);
    this.widgets.set(banner2.id, banner2);

    // Add more story bar widgets to match the design reference
    const storyBar1 = {
      id: this.currentWidgetId++,
      name: "Personalization",
      type: "story-bar",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "Personalization Story Group",
        description: "AI-powered personalized stories",
        audience: "Audience",
        storyGroup: "Personalization",
        hasPersonalization: true,
        imageUrl: "personalization.jpg",
      },
      style: {
        backgroundColor: "#6366F1",
        textColor: "#FFFFFF",
        layout: "circular",
        fontSize: "16px",
      },
      placementId: placement1.id,
      status: "active",
      scheduledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const storyBar2 = {
      id: this.currentWidgetId++,
      name: "YT1",
      type: "story-bar",
      isRecipeWidget: false,
      parentRecipeId: null,
      content: {
        title: "YT1 Story Group",
        description: "Featured story content",
        audience: "Audience",
        storyGroup: "YT1",
        hasPersonalization: true,
        imageUrl: "yt1-story.jpg",
      },
      style: {
        backgroundColor: "#8B5CF6",
        textColor: "#FFFFFF",
        layout: "circular",
        fontSize: "16px",
      },
      placementId: placement2.id,
      status: "active",
      scheduledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    // Add story bar widgets to storage
    this.widgets.set(storyBar1.id, storyBar1);
    this.widgets.set(storyBar2.id, storyBar2);

    // Sample recipes
    const recipe1 = {
      id: this.currentRecipeId++,
      name: "Summer Sale Campaign",
      goal: "highlight-promotion",
      template: "banner-feed",
      category: "standard",
      workflow: {
        steps: [
          {
            id: "step1",
            type: "banner",
            config: { title: "Review Banner", placement: "homepage" },
            position: { x: 100, y: 100 },
          },
          {
            id: "step2",
            type: "personalization",
            config: { enabled: true, algorithm: "collaborative" },
            position: { x: 300, y: 100 },
          },
        ],
        connections: [{ from: "step1", to: "step2" }],
      },
      productFeed: {
        connected: true,
        url: "https://api.example.com/products",
        mappings: { title: "name", price: "price" },
      },
      aiPersonalization: true,
      deliveryCondition: "user_location == 'US'",
      status: "active",
      performance: {
        conversionRate: 4.2,
        clickThroughRate: 8.5,
        impressions: 15000,
      },
      metadata: {
        selectedWidgets: [],
        widgetFeedAssociations: {},
        selectedFeed: "",
        selectedCollection: "",
        widgetCount: 0,
        hasAI: true,
        collectionName: "",
        feedName: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Recipe;

    const recipe2 = {
      id: this.currentRecipeId++,
      name: "Product Launch Flow",
      goal: "launch-product",
      template: "story-quiz-card",
      category: "standard",
      workflow: {
        steps: [
          {
            id: "step1",
            type: "story",
            config: { title: "New Product Story", autoplay: true },
            position: { x: 100, y: 100 },
          },
          {
            id: "step2",
            type: "quiz",
            config: {
              question: "What's your style?",
              options: ["Classic", "Modern"],
            },
            position: { x: 300, y: 100 },
          },
        ],
        connections: [{ from: "step1", to: "step2" }],
      },
      productFeed: {
        connected: false,
      },
      aiPersonalization: false,
      deliveryCondition: "new_user == true",
      status: "draft",
      performance: {
        conversionRate: 2.1,
        clickThroughRate: 12.3,
        impressions: 5000,
      },
      metadata: {
        selectedWidgets: [],
        widgetFeedAssociations: {},
        selectedFeed: "",
        selectedCollection: "",
        widgetCount: 0,
        hasAI: false,
        collectionName: "",
        feedName: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Recipe;

    const recipe3 = {
      id: this.currentRecipeId++,
      name: "Build Wishlist Campaign",
      goal: "build-wishlist",
      template: "wishlist-engagement-banner",
      category: "standard",
      workflow: {
        steps: [
          {
            id: "step1",
            type: "banner",
            config: { title: "Add to Wishlist", placement: "product-page" },
            position: { x: 100, y: 100 },
          },
          {
            id: "step2",
            type: "personalization",
            config: { enabled: true, algorithm: "wishlist-optimized" },
            position: { x: 300, y: 100 },
          },
        ],
        connections: [{ from: "step1", to: "step2" }],
      },
      productFeed: {
        connected: true,
        url: "https://api.example.com/products",
        mappings: { title: "name", price: "price", wishlist: "favorite" },
      },
      aiPersonalization: true,
      deliveryCondition: "wishlist_items < 5",
      status: "active",
      performance: {
        conversionRate: 6.8,
        clickThroughRate: 15.2,
        impressions: 8500,
      },
      metadata: {
        selectedWidgets: [],
        widgetFeedAssociations: {},
        selectedFeed: "",
        selectedCollection: "",
        widgetCount: 0,
        hasAI: true,
        collectionName: "",
        feedName: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Recipe;

    this.recipes.set(recipe1.id, recipe1);
    this.recipes.set(recipe2.id, recipe2);
    this.recipes.set(recipe3.id, recipe3);

    // Sample audience segments
    const segment1 = {
      id: this.currentSegmentId++,
      name: "Premium Customers",
      description: "High-value customers with multiple purchases",
      conditions: {
        rules: [
          { field: "purchase_count", operator: ">=", value: "5" },
          { field: "total_spent", operator: ">=", value: "500" },
        ],
      },
      userCount: 1250,
      createdAt: new Date(),
    } as AudienceSegment;

    const segment2 = {
      id: this.currentSegmentId++,
      name: "New Visitors",
      description: "Users who visited in the last 7 days",
      conditions: {
        rules: [{ field: "first_visit", operator: ">=", value: "7_days_ago" }],
      },
      userCount: 3400,
      createdAt: new Date(),
    } as AudienceSegment;

    this.audienceSegments.set(segment1.id, segment1);
    this.audienceSegments.set(segment2.id, segment2);

    // Sample analytics data for wishlist metrics
    const wishlistAnalytics1 = {
      id: this.currentAnalyticsId++,
      entityType: "recipe",
      entityId: recipe3.id,
      metric: "add-to-wishlist-rate",
      value: 1250,
      date: new Date(),
    } as Analytics;

    const wishlistAnalytics2 = {
      id: this.currentAnalyticsId++,
      entityType: "recipe",
      entityId: recipe3.id,
      metric: "product-detail-page-visits",
      value: 45200,
      date: new Date(),
    } as Analytics;

    const wishlistAnalytics3 = {
      id: this.currentAnalyticsId++,
      entityType: "recipe",
      entityId: recipe3.id,
      metric: "wishlist-engagement",
      value: 6800,
      date: new Date(),
    } as Analytics;

    this.analytics.set(wishlistAnalytics1.id, wishlistAnalytics1);
    this.analytics.set(wishlistAnalytics2.id, wishlistAnalytics2);
    this.analytics.set(wishlistAnalytics3.id, wishlistAnalytics3);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Widget methods
  async getWidgets(): Promise<Widget[]> {
    return Array.from(this.widgets.values());
  }

  async getWidget(id: number): Promise<Widget | undefined> {
    return this.widgets.get(id);
  }

  async createWidget(insertWidget: InsertWidget): Promise<Widget> {
    const id = this.currentWidgetId++;
    // @ts-ignore
    const widget: Widget = {
      ...insertWidget,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.widgets.set(id, widget);
    return widget;
  }

  async updateWidget(
    id: number,
    updateWidget: Partial<InsertWidget>
  ): Promise<Widget> {
    const existing = this.widgets.get(id);
    if (!existing) {
      throw new Error(`Widget with id ${id} not found`);
    }
    // @ts-ignore
    const updated: Widget = {
      ...existing,
      ...updateWidget,
      updatedAt: new Date(),
    };
    this.widgets.set(id, updated);
    return updated;
  }

  async deleteWidget(id: number): Promise<void> {
    this.widgets.delete(id);
  }

  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentRecipeId++;
    // @ts-ignore
    const recipe: Recipe = {
      ...insertRecipe,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async updateRecipe(
    id: number,
    updateRecipe: Partial<InsertRecipe>
  ): Promise<Recipe> {
    const existing = this.recipes.get(id);
    if (!existing) {
      throw new Error(`Recipe with id ${id} not found`);
    }
    // @ts-ignore
    const updated: Recipe = {
      ...existing,
      ...updateRecipe,
      updatedAt: new Date(),
    };
    this.recipes.set(id, updated);
    return updated;
  }

  async deleteRecipe(id: number): Promise<void> {
    this.recipes.delete(id);
  }

  // Placement methods
  async getPlacements(): Promise<Placement[]> {
    return Array.from(this.placements.values());
  }

  async getPlacement(id: number): Promise<Placement | undefined> {
    return this.placements.get(id);
  }

  async createPlacement(insertPlacement: InsertPlacement): Promise<Placement> {
    const id = this.currentPlacementId++;
    // @ts-ignore
    const placement: Placement = {
      ...insertPlacement,
      id,
      createdAt: new Date(),
    };
    this.placements.set(id, placement);
    return placement;
  }

  async updatePlacement(
    id: number,
    updatePlacement: Partial<InsertPlacement>
  ): Promise<Placement> {
    const existing = this.placements.get(id);
    if (!existing) {
      throw new Error(`Placement with id ${id} not found`);
    }
    // @ts-ignore
    const updated: Placement = {
      ...existing,
      ...updatePlacement,
    };
    this.placements.set(id, updated);
    return updated;
  }

  async deletePlacement(id: number): Promise<void> {
    this.placements.delete(id);
  }

  // Audience segment methods
  async getAudienceSegments(): Promise<AudienceSegment[]> {
    return Array.from(this.audienceSegments.values());
  }

  async getAudienceSegment(id: number): Promise<AudienceSegment | undefined> {
    return this.audienceSegments.get(id);
  }

  async createAudienceSegment(
    insertSegment: InsertAudienceSegment
  ): Promise<AudienceSegment> {
    const id = this.currentSegmentId++;
    // @ts-ignore
    const segment: AudienceSegment = {
      ...insertSegment,
      id,
      createdAt: new Date(),
    };
    this.audienceSegments.set(id, segment);
    return segment;
  }

  async updateAudienceSegment(
    id: number,
    updateSegment: Partial<InsertAudienceSegment>
  ): Promise<AudienceSegment> {
    const existing = this.audienceSegments.get(id);
    if (!existing) {
      throw new Error(`Audience segment with id ${id} not found`);
    }
    // @ts-ignore
    const updated: AudienceSegment = {
      ...existing,
      ...updateSegment,
    };
    this.audienceSegments.set(id, updated);
    return updated;
  }

  async deleteAudienceSegment(id: number): Promise<void> {
    this.audienceSegments.delete(id);
  }

  // Analytics methods
  async getAnalytics(
    entityType?: string,
    entityId?: number
  ): Promise<Analytics[]> {
    const allAnalytics = Array.from(this.analytics.values());

    if (entityType && entityId) {
      return allAnalytics.filter(
        (a) => a.entityType === entityType && a.entityId === entityId
      );
    }

    if (entityType) {
      return allAnalytics.filter((a) => a.entityType === entityType);
    }

    return allAnalytics;
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    // @ts-ignore
    const analytics: Analytics = {
      ...insertAnalytics,
      id,
      date: new Date(),
    };
    this.analytics.set(id, analytics);
    return analytics;
  }
}

export const storage = new MemStorage();
