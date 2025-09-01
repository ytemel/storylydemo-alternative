import { InsertRecipe, insertRecipeSchema, InsertWidget } from "@/shared/schema";
import { storage } from "../storage";
import { WIDGET_DEFINITIONS } from "@/lib/widget-definitions";

function inferWidgetIdsFromTemplate(templateId: string): string[] {
  const lower = templateId.toLowerCase();
  const matches: string[] = [];
  const pushIf = (cond: boolean, id: string) => { if (cond) matches.push(id); };
  pushIf(lower.includes("swipe-card"), "swipe-card");
  pushIf(lower.includes("banner"), "banner");
  pushIf(lower.includes("carousel"), "carousel");
  // Map generic feed terms to video-feed
  pushIf(lower.includes("video-feed") || lower.includes("feed"), "video-feed");
  // Never auto-create story here; story managed separately
  return Array.from(new Set(matches.filter((id) => id !== "story-bar")));
}

export async function getRecipes() {
  try {
    const recipes = await storage.getRecipes();
    return recipes;
  } catch {
    throw new Error("Failed to fetch recipes");
  }
}

export async function getRecipe(id: string) {
  try {
    const recipe = await storage.getRecipe(parseInt(id));
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return recipe;
  } catch {
    throw new Error("Failed to fetch recipe");
  }
}

export async function createRecipe(recipeData: InsertRecipe) {
  try {
    console.log("Creating recipe with data:", recipeData);
    const parsedRecipeData = insertRecipeSchema.parse(recipeData);
    const recipe = await storage.createRecipe(parsedRecipeData);
    console.log("Recipe created with ID:", recipe.id);

    const widgetLikeTemplate = WIDGET_DEFINITIONS.find(
      (w) => w.id === (parsedRecipeData.template as any)
    );

    let widgetIds: string[] = [];
    if ((parsedRecipeData as any).category === "widgets-only" || widgetLikeTemplate) {
      widgetIds = [(parsedRecipeData.template as any)];
    } else {
      widgetIds = inferWidgetIdsFromTemplate(parsedRecipeData.template as any);
    }

    for (const widgetType of widgetIds) {
      if (widgetType === "story-bar") continue;
      const widgetName = `${widgetType} for ${parsedRecipeData.name}`;
      const widget: InsertWidget = {
        name: widgetName,
        type: widgetType as any,
        isRecipeWidget: true,
        parentRecipeId: recipe.id,
        status: "draft",
        content: {},
        style: {},
      } as any;
      console.log("Widget data to create:", widget);
      const createdWidget = await storage.createWidget(widget);
      console.log("Widget created with ID:", createdWidget.id);
    }

    return recipe;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw new Error("Invalid recipe data");
  }
}

export async function updateRecipe(id: string, recipeData: InsertRecipe) {
  try {
    const parsedRecipeData = insertRecipeSchema.partial().parse(recipeData);
    const recipe = await storage.updateRecipe(parseInt(id), parsedRecipeData);
    return recipe;
  } catch {
    throw new Error("Failed to update recipe");
  }
}

export async function deleteRecipe(id: string) {
  try {
    await storage.deleteRecipe(parseInt(id));
    return;
  } catch {
    throw new Error("Failed to delete recipe");
  }
}
