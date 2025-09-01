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
      // @ts-ignore
      return await getWidget(widgetId);
    }
    // Handle other GET requests through the regular query function
    // @ts-ignore
    return await mockGetServer[url as keyof typeof mockGetServer]();
  } else if (method === "POST") {
    // @ts-ignore
    try {
      // @ts-ignore
      return await mockPostServer[url as keyof typeof mockPostServer](data);
    } catch (e: any) {
      throw new Error(e?.message || "Request failed");
    }
  } else if (method === "PUT") {
    // @ts-ignore
    return mockPutServer[url as keyof typeof mockPutServer](id, data);
  } else if (method === "DELETE") {
    // @ts-ignore
    return mockDeleteServer[url as keyof typeof mockDeleteServer](id);
  }
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
