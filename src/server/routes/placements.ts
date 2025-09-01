import { InsertPlacement, insertPlacementSchema } from "@/shared/schema";
import { storage } from "../storage";

export async function getPlacements() {
  try {
    const placements = await storage.getPlacements();
    return placements;
  } catch {
    throw new Error("Failed to fetch placements");
  }
}

export async function getPlacement(id: string) {
  try {
    const placement = await storage.getPlacement(parseInt(id));
    if (!placement) {
      throw new Error("Placement not found");
    }
    return placement;
  } catch {
    throw new Error("Failed to fetch placement");
  }
}

export async function createPlacement(placementData: InsertPlacement) {
  try {
    const parsedPlacementData = insertPlacementSchema.parse(placementData);
    const placement = await storage.createPlacement(parsedPlacementData);
    return placement;
  } catch {
    throw new Error("Invalid placement data");
  }
}

export async function updatePlacement(
  id: string,
  placementData: InsertPlacement
) {
  try {
    const parsedPlacementData = insertPlacementSchema
      .partial()
      .parse(placementData);
    const placement = await storage.updatePlacement(
      parseInt(id),
      parsedPlacementData
    );
    return placement;
  } catch {
    throw new Error("Failed to update placement");
  }
}

export async function deletePlacement(id: string) {
  try {
    await storage.deletePlacement(parseInt(id));
    return;
  } catch {
    throw new Error("Failed to delete placement");
  }
}
