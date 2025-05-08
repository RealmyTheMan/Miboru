import { save } from "@tauri-apps/plugin-dialog";
import { appDataDir } from "@tauri-apps/api/path";
import { copyFile } from "@tauri-apps/plugin-fs";
import type { MediaItem } from "$lib/types/Media";

export async function saveMediaItem(item: MediaItem) {
  const appDataPath = await appDataDir();

  const path = await save({
    filters: [
      {
        name: item.title || "Untitled media",
        extensions: [item.extension],
      },
    ],
  });

  if (path) {
    await copyFile(`${appDataPath}/_gallery/${item.id}/item`, path);
  }
}
