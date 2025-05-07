import { BaseDirectory, create, mkdir } from "@tauri-apps/plugin-fs";
import { mkid } from "$lib/src/local/imports/mkid";
import { openDb } from "$lib/src/local/imports/db";
import type { MediaSaveParams, MediaSaveResponse } from "$lib/src/api/add";

export async function saveMediaToMachine(
  params: MediaSaveParams,
): Promise<MediaSaveResponse> {
  const db = await openDb();

  const id = mkid();

  await mkdir(`_gallery/${id}`, {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });
  const diskFile = await create(`_gallery/${id}/item`, {
    baseDir: BaseDirectory.AppData,
  });
  await diskFile.write(await params.file.bytes());
  await diskFile.close();

  await db.execute("INSERT INTO media (id, type, title) VALUES (?, ?, ?)", [
    id,
    params.file.type,
    params.automaticTitle,
  ]);

  return { id };
}
