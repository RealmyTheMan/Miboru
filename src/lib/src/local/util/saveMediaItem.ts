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
    await copyFile(
      `${appDataPath}/gallery/${item.id.slice(0, 2)}/${item.id.slice(2, 4)}/${item.id}/item`,
      path,
    );
  }
}
