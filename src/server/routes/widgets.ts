import { InsertWidget, insertWidgetSchema } from "@/shared/schema";
import { storage } from "../storage";
import { recipes } from "@/shared/schema";

export async function getWidgets() {
  try {
    const widgets = await storage.getWidgets();
    return widgets;
  } catch {
    throw new Error("Failed to fetch widgets");
  }
}

export async function getWidget(id: string) {
  try {
    const widget = await storage.getWidget(parseInt(id));
    if (!widget) {
      throw new Error("Widget not found");
    }
    return widget;
  } catch {
    throw new Error("Failed to fetch widget");
  }
}

export async function createWidget(widgetData: InsertWidget) {
  try {
    const parsedWidgetData = insertWidgetSchema.parse(widgetData);
    // Enforce rule: non-Story widgets must be created within a Recipe (have parentRecipeId)
    const isStory = parsedWidgetData.type === "story-bar";
    if (!isStory && !parsedWidgetData.parentRecipeId) {
      throw new Error("Create widgets inside a Recipe.");
    }
    // If parent recipe is "widgets-only", never allow story-bar
    if (parsedWidgetData.parentRecipeId) {
      const parent = await storage.getRecipe(parsedWidgetData.parentRecipeId);
      if ((parent as any)?.category === "widgets-only" && isStory) {
        throw new Error("Story widgets are not allowed in Widgets Only category.");
      }
    }
    const widget = await storage.createWidget(parsedWidgetData);
    return widget;
  } catch {
    throw new Error("Invalid widget data");
  }
}

export async function updateWidget(id: string, widgetData: InsertWidget) {
  try {
    const parsedWidgetData = insertWidgetSchema.partial().parse(widgetData);
    const widget = await storage.updateWidget(parseInt(id), parsedWidgetData);
    return widget;
  } catch {
    throw new Error("Failed to update widget");
  }
}

export async function deleteWidget(id: string) {
  try {
    await storage.deleteWidget(parseInt(id));
    return;
  } catch {
    throw new Error("Failed to delete widget");
  }
}
