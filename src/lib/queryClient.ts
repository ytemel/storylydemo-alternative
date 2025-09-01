import { getAnalytics } from "@/server/routes/analytics";
import {
  createAudienceSegment,
  deleteAudienceSegment,
  getAudienceSegments,
  updateAudienceSegment,
} from "@/server/routes/audienceSegments";
import {
  createRecipe,
  deleteRecipe,
  getRecipes,
  updateRecipe,
} from "@/server/routes/recipes";
import {
  createWidget,
  deleteWidget,
  getWidgets,
  getWidget,
  updateWidget,
} from "@/server/routes/widgets";
import {
  createPlacement,
  deletePlacement,
  getPlacements,
  updatePlacement,
} from "@/server/routes/placements";
import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { InsertPlacement } from "@/shared/schema";

export const mockGetServer = {
  "/api/placements": getPlacements,
  "/api/recipes": getRecipes,
  "/api/widgets": getWidgets,
  "/api/audience-segments": getAudienceSegments,
};

export const mockPostServer = {
  "/api/placements": createPlacement,
  "/api/recipes": createRecipe,
  "/api/widgets": createWidget,
  "/api/audience-segments": createAudienceSegment,
};

export const mockPutServer = {
  "/api/placements": updatePlacement,
  "/api/recipes": updateRecipe,
  "/api/widgets": updateWidget,
  "/api/audience-segments": updateAudienceSegment,
};

export const mockDeleteServer = {
  "/api/placements": deletePlacement,
  "/api/recipes": deleteRecipe,
  "/api/widgets": deleteWidget,
  "/api/audience-segments": deleteAudienceSegment,
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  id?: number
) {
  if (method === "GET") {
    // Handle individual widget requests
    if (url.startsWith("/api/widgets/") && url !== "/api/widgets") {
      const widgetId = url.split("/").pop();
      if (!widgetId) {
        throw new Error("Invalid widget ID");
      }
      const result = await getWidget(widgetId);
      if (!result) {
        throw new Error("Widget not found");
      }
      return result;
    }
    // Handle other GET requests through the regular query function
    const result = await mockGetServer[url as keyof typeof mockGetServer]();
    if (!result) {
      throw new Error("No data returned");
    }
    return result;
  } else if (method === "POST") {
    try {
      const result = await mockPostServer[url as keyof typeof mockPostServer](data as any);
      if (!result) {
        throw new Error("No data returned");
      }
      return result;
    } catch (e: any) {
      throw new Error(e?.message || "Request failed");
    }
  } else if (method === "PUT") {
    if (id === undefined) {
      throw new Error("ID is required for PUT requests");
    }
    const result = await mockPutServer[url as keyof typeof mockPutServer](id.toString(), data as any);
    if (!result) {
      throw new Error("No data returned");
    }
    return result;
  } else if (method === "DELETE") {
    if (id === undefined) {
      throw new Error("ID is required for DELETE requests");
    }
    const result = await mockDeleteServer[url as keyof typeof mockDeleteServer](id.toString());
    // DELETE operations might return void, so we don't check for result
    return result;
  }
  throw new Error("Unsupported HTTP method");
}

export const getQueryFn =
  () =>
  async ({ queryKey }: { queryKey: string[] }) => {
    const res = await mockGetServer[
      queryKey[0] as keyof typeof mockGetServer
    ]();
    return res;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // @ts-ignore
      queryFn: getQueryFn(),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
