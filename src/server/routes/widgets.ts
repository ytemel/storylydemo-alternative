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
    
    // Validate widget type constraints
    const isRecipeWidget = (parsedWidgetData as any).isRecipeWidget;
    
    // Recipe widgets cannot have placementId
    if (isRecipeWidget && parsedWidgetData.placementId) {
      throw new Error("Recipe widgets cannot be assigned to placements");
    }
    
    // Widget only widgets cannot have parentRecipeId
    if (!isRecipeWidget && parsedWidgetData.parentRecipeId) {
      throw new Error("Widget only widgets cannot be assigned to recipes");
    }
    
    // If parent recipe is "widgets-only", never allow story-bar
    if (parsedWidgetData.parentRecipeId) {
      const parent = await storage.getRecipe(parsedWidgetData.parentRecipeId);
      if ((parent as any)?.category === "widgets-only" && parsedWidgetData.type === "story-bar") {
        throw new Error("Story widgets are not allowed in Widgets Only category.");
      }
    }
    
    const widget = await storage.createWidget(parsedWidgetData);
    return widget;
  } catch (error: any) {
    throw new Error(error.message || "Invalid widget data");
  }
}

export async function updateWidget(id: string, widgetData: InsertWidget) {
  try {
    const parsedWidgetData = insertWidgetSchema.partial().parse(widgetData);
    
    // Get existing widget to check constraints
    const existingWidget = await storage.getWidget(parseInt(id));
    if (!existingWidget) {
      throw new Error("Widget not found");
    }
    
    // Prevent changing widget type if already attached to recipe or placement
    if ((parsedWidgetData as any).isRecipeWidget !== undefined) {
      const isCurrentlyAttached = existingWidget.parentRecipeId || existingWidget.placementId;
      if (isCurrentlyAttached) {
        throw new Error("Cannot change widget type - widget is already attached to a recipe or placement");
      }
    }
    
    // Validate widget type constraints for updates
    const isRecipeWidget = (parsedWidgetData as any).isRecipeWidget ?? (existingWidget as any).isRecipeWidget;
    
    // Recipe widgets cannot have placementId
    if (isRecipeWidget && parsedWidgetData.placementId) {
      throw new Error("Recipe widgets cannot be assigned to placements");
    }
    
    // Widget only widgets cannot have parentRecipeId  
    if (!isRecipeWidget && parsedWidgetData.parentRecipeId) {
      throw new Error("Widget only widgets cannot be assigned to recipes");
    }
    
    const widget = await storage.updateWidget(parseInt(id), parsedWidgetData);
    return widget;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update widget");
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
