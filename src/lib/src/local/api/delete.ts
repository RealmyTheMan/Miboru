import { BaseDirectory, remove } from "@tauri-apps/plugin-fs";
import type {
  MediaDeleteParams,
  MediaDeleteResponse,
} from "$lib/src/api/delete";
import { openDb } from "$lib/src/local/imports/db";

export async function deleteMediaFromMachine(
  params: MediaDeleteParams,
): Promise<MediaDeleteResponse> {
  const db = await openDb();

  await db.execute(
    [
      "UPDATE tags SET count = count - 1 WHERE id IN",
      "(SELECT id FROM tags t JOIN media_tags mt ON t.id = mt.tag_id WHERE mt.media_id = ? LIMIT 50)",
    ].join(" "),
    [params.id],
  );

  await db.execute("DELETE FROM media WHERE id = ?", [params.id]);
  await remove(
    `gallery/${params.id.slice(0, 2)}/${params.id.slice(2, 4)}/${params.id}`,
    {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    },
  );

  return { id: params.id };
}
