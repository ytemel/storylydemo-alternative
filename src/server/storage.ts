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

    // Start with empty widgets - users will create their own
    // this.widgets.set(widget1.id, widget1);
    // this.widgets.set(widget2.id, widget2);

    // Commented out sample widgets - users will create their own
    /*
    const widget3 = {
      id: this.currentWidgetId++,
      name: "yt-test-banner1",
      type: "banner",
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
      name: "android",
      type: "story-bar",
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

    const widget5 = {
      id: this.currentWidgetId++,
      name: "yt-test",
      type: "story-bar",
      content: {
        title: "Brand Stories",
        description: "Engaging brand content",
      },
      style: {
        backgroundColor: "#EC4899",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement1.id,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const widget6 = {
      id: this.currentWidgetId++,
      name: "Product Swipe Cards",
      type: "swipe-card",
      content: {
        title: "Interactive Products",
        description: "Swipe to explore products",
      },
      style: {
        backgroundColor: "#8B5CF6",
        textColor: "#FFFFFF",
        layout: "vertical",
        fontSize: "16px",
      },
      placementId: placement2.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const widget7 = {
      id: this.currentWidgetId++,
      name: "Product Carousel",
      type: "carousel",
      content: {
        title: "Featured Products",
        description: "Scroll through our best items",
      },
      style: {
        backgroundColor: "#10B981",
        textColor: "#FFFFFF",
        layout: "horizontal",
        fontSize: "16px",
      },
      placementId: placement1.id,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Widget;

    const widget8 = {
      id: this.currentWidgetId++,
      name: "Flash Sale Countdown",
      type: "countdown",
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
      name: "Video Feed",
      type: "video-feed",
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

    this.widgets.set(widget3.id, widget3);
    this.widgets.set(widget4.id, widget4);
    this.widgets.set(widget5.id, widget5);
    this.widgets.set(widget6.id, widget6);
    this.widgets.set(widget7.id, widget7);
    this.widgets.set(widget8.id, widget8);
    this.widgets.set(widget9.id, widget9);
    this.widgets.set(widget10.id, widget10);
    */

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
