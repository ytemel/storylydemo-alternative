export type WidgetType = 'banner' | 'story-bar' | 'video-feed' | 'carousel';

export type RecipeGoal = 'highlight-promotion' | 'launch-product' | 'promote-category' | 'cross-sell' | 'collect-reviews';

export type RecipeTemplate = 'banner-feed' | 'story-quiz-card' | 'carousel-ugc-banner' | 'custom';

export interface WidgetContent {
  title?: string;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
  videoUrl?: string;
  destinationUrl?: string;
}

export interface WidgetStyle {
  backgroundColor?: string;
  textColor?: string;
  layout?: string;
  fontSize?: string;
}

export interface RecipeWorkflowStep {
  id: string;
  type: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface RecipeWorkflow {
  steps: RecipeWorkflowStep[];
  connections: Array<{
    from: string;
    to: string;
  }>;
}

export interface ProductFeed {
  connected: boolean;
  url?: string;
  mappings?: Record<string, string>;
}

export interface RecipePerformance {
  conversionRate?: number;
  clickThroughRate?: number;
  impressions?: number;
}

export interface AudienceConditions {
  rules: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
}

export interface MetricData {
  value: string | number;
  label: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface WishlistMetrics {
  addToWishlistRate: number;
  productDetailPageVisits: number;
  wishlistEngagement: number;
  wishlistConversionRate: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}
