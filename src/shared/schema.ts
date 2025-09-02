import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const widgets = pgTable("widgets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'banner', 'story-bar', 'video-feed', 'carousel'
  isRecipeWidget: boolean("is_recipe_widget").default(false), // true for recipe-only widgets, false for widget only
  parentRecipeId: integer("parent_recipe_id"),
  content: json("content").$type<{
    title?: string;
    description?: string;
    buttonText?: string;
    imageUrl?: string;
    videoUrl?: string;
    destinationUrl?: string;
    collection?: string;
    audience?: string;
    slides?: string[];
    questions?: string[];
    endTime?: Date;
  }>(),
  style: json("style").$type<{
    backgroundColor?: string;
    textColor?: string;
    layout?: string;
    fontSize?: string;
  }>(),
  placementId: integer("placement_id"),
  status: text("status").default("draft"), // 'draft', 'active', 'paused', 'detached', 'archived', 'scheduled', 'inactive'
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  goal: text("goal"), // 'highlight-promotion', 'launch-product', 'cross-sell', etc.
  template: text("template").notNull(), // 'banner-feed', 'story-quiz-card', etc.
  category: text("category").default("standard"), // 'standard', 'widgets-only'
  workflow: json("workflow").$type<{
    steps: Array<{
      id: string;
      type: string;
      config: Record<string, any>;
      position: { x: number; y: number };
    }>;
    connections: Array<{
      from: string;
      to: string;
    }>;
  }>(),
  productFeed: json("product_feed").$type<{
    connected: boolean;
    url?: string;
    mappings?: Record<string, string>;
  }>(),
  aiPersonalization: boolean("ai_personalization").default(false),
  deliveryCondition: text("delivery_condition"),
  status: text("status").default("draft"), // 'draft', 'active', 'testing', 'paused'
  performance: json("performance").$type<{
    conversionRate?: number;
    clickThroughRate?: number;
    impressions?: number;
  }>(),
  metadata: json("metadata").$type<{
    selectedWidgets?: number[];
    widgetFeedAssociations?: Record<number, {
      feed?: string;
      collection?: string;
      storyGroup?: string;
      slides?: string[];
    }>;
    selectedFeed?: string;
    selectedCollection?: string;
    widgetCount?: number;
    hasAI?: boolean;
    collectionName?: string;
    feedName?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const placements = pgTable("placements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // 'ios', 'android', 'web'
  sdkToken: text("sdk_token").notNull(),
  widgetId: integer("widget_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const audienceSegments = pgTable("audience_segments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  conditions: json("conditions").$type<{
    rules: Array<{
      field: string;
      operator: string;
      value: string;
    }>;
  }>(),
  userCount: integer("user_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(), // 'widget', 'recipe', 'placement'
  entityId: integer("entity_id").notNull(),
  metric: text("metric").notNull(), // 'impressions', 'clicks', 'conversions'
  value: integer("value").notNull(),
  date: timestamp("date").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWidgetSchema = createInsertSchema(widgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlacementSchema = createInsertSchema(placements).omit({
  id: true,
  createdAt: true,
});

export const insertAudienceSegmentSchema = createInsertSchema(audienceSegments).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  date: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Widget = typeof widgets.$inferSelect;
export type InsertWidget = z.infer<typeof insertWidgetSchema>;

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export type Placement = typeof placements.$inferSelect;
export type InsertPlacement = z.infer<typeof insertPlacementSchema>;

export type AudienceSegment = typeof audienceSegments.$inferSelect;
export type InsertAudienceSegment = z.infer<typeof insertAudienceSegmentSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
