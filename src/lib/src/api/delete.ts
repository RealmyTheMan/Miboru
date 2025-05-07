import { ENVIRONMENT } from "$lib/data/const";
import { deleteMediaFromMachine } from "$lib/src/local/api/delete";

export interface MediaDeleteParams {
  id: string;
}

export interface MediaDeleteResponse {
  id: string;
}

export async function deleteMedia(
  params: MediaDeleteParams,
): Promise<MediaDeleteResponse> {
  if (ENVIRONMENT === "desktop") {
    return await deleteMediaFromMachine(params);
  } else {
    throw new Error("Unknown environment");
  }
}
