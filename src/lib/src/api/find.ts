import { ENVIRONMENT } from "$lib/data/const";
import type { MediaItem } from "$lib/types/Media";
import { findMediaOnMachine } from "$lib/src/local/api/find";

export interface MediaFindParams {
  keywords: string[];
  page: number;
  limit: number;
}

export interface MediaFindResponse {
  items: MediaItem[];
}

export async function findMedia(
  params: MediaFindParams,
): Promise<MediaFindResponse> {
  if (ENVIRONMENT === "desktop") {
    return await findMediaOnMachine(params);
  } else {
    throw new Error("Unknown environment");
  }
}
