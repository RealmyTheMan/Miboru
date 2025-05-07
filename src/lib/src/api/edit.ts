import { ENVIRONMENT } from "$lib/data/const";
import { editMediaOnMachine } from "../local/api/edit";

export interface MediaEditParams {
  id: string;
  fields: {
    title?: string;
    tags?: string[];
  };
}

export interface MediaEditResponse {
  fields: {
    title?: string;
    tags?: string[];
  };
}

export async function editMedia(
  params: MediaEditParams,
): Promise<MediaEditResponse> {
  if (ENVIRONMENT === "desktop") {
    return await editMediaOnMachine(params);
  } else {
    throw new Error("Unknown environment");
  }
}
