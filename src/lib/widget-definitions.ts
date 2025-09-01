import { Image, BarChart3, Video } from "lucide-react";

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  icon: any;
  platforms: string[];
}

export const WIDGET_DEFINITIONS: WidgetDefinition[] = [
  {
    id: "story-bar",
    name: "Story Bar",
    description:
      "Use this widget only widget to display videos as Instagram-style stories on any page of your store.",
    icon: Video,
    platforms: ["Mobile", "Desktop"],
  },
  {
    id: "standalone-story-bar",
    name: "Widget Only Story Bar",
    description:
      "A recipe-only version of the Story Bar, specifically designed for use within recipes.",
    icon: Video,
    platforms: ["Mobile", "Desktop"],
  },
  {
    id: "video-feed",
    name: "Video feed",
    description:
      "Use this widget to show specific videos as a carousel or in grid view on any page of your store.",
    icon: BarChart3,
    platforms: ["Mobile", "Desktop"],
  },
  {
    id: "banner",
    name: "Banner",
    description:
      "Use this widget to create banners with image, video or text. Display them as single or carousel.",
    icon: Image,
    platforms: ["Mobile"],
  },
  {
    id: "carousel",
    name: "Carousel",
    description: "Multi-item carousel to showcase products or content.",
    icon: Image,
    platforms: ["Mobile", "Desktop"],
  },
  {
    id: "swipe-card",
    name: "Swipe Card",
    description: "Engaging swipeable cards for fast product discovery.",
    icon: Image,
    platforms: ["Mobile", "Desktop"],
  },
];

export function getEligibleWidgetsForWidgetsOnly() {
  return WIDGET_DEFINITIONS.filter((w) => 
    w.id !== "story-bar" && w.id !== "standalone-story-bar"
  );
}

// Get recipe-only widget types
export function getRecipeOnlyWidgetTypes() {
  return WIDGET_DEFINITIONS.filter((w) => w.id === "standalone-story-bar");
}


