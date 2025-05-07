import { ENVIRONMENT } from "$lib/data/const";
import { saveMediaToMachine } from "../local/api/add";

export interface MediaSaveParams {
  file: Blob;
  automaticTitle: string | null;
}

export interface MediaSaveResponse {
  id: string;
}

export async function addMedia(
  params: MediaSaveParams,
): Promise<MediaSaveResponse> {
  if (ENVIRONMENT === "desktop") {
    return await saveMediaToMachine(params);
  } else {
    throw new Error("Unknown environment");
  }
}
