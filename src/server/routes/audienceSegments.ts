import {
  InsertAudienceSegment,
  insertAudienceSegmentSchema,
} from "@/shared/schema";
import { storage } from "../storage";

export async function getAudienceSegments() {
  try {
    const segments = await storage.getAudienceSegments();
    return segments;
  } catch {
    throw new Error("Failed to fetch audience segments");
  }
}

export async function getAudienceSegment(id: string) {
  try {
    const segment = await storage.getAudienceSegment(parseInt(id));
    if (!segment) {
      throw new Error("Audience segment not found");
    }
    return segment;
  } catch {
    throw new Error("Failed to fetch audience segment");
  }
}

export async function createAudienceSegment(
  segmentData: InsertAudienceSegment
) {
  try {
    const segment = await storage.createAudienceSegment(segmentData);
    return segment;
  } catch {
    throw new Error("Invalid audience segment data");
  }
}

export async function updateAudienceSegment(
  id: string,
  segmentData: InsertAudienceSegment
) {
  try {
    const parsedSegmentData = insertAudienceSegmentSchema
      .partial()
      .parse(segmentData);
    const segment = await storage.updateAudienceSegment(
      parseInt(id),
      parsedSegmentData
    );
    return segment;
  } catch {
    throw new Error("Failed to update audience segment");
  }
}

export async function deleteAudienceSegment(id: string) {
  try {
    await storage.deleteAudienceSegment(parseInt(id));
    return;
  } catch {
    throw new Error("Failed to delete audience segment");
  }
}
