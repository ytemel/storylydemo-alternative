import { storage } from "../storage";

export async function getAnalytics(query: {
  entityType?: string;
  entityId?: string;
}) {
  try {
    const { entityType, entityId } = query;
    const analytics = await storage.getAnalytics(
      entityType as string,
      entityId ? parseInt(entityId as string) : undefined
    );
    return analytics;
  } catch {
    throw new Error("Failed to fetch analytics");
  }
}
