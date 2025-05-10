import { BaseDirectory, create, mkdir, writeFile } from "@tauri-apps/plugin-fs";
import { convertFileSrc } from "@tauri-apps/api/core";
import { mkid } from "$lib/src/local/imports/mkid";
import { openDb } from "$lib/src/local/imports/db";
import type { MediaSaveParams, MediaSaveResponse } from "$lib/src/api/add";
import { getVideoThumbnail } from "$lib/util/getVideoThumbnail";
import { appDataDir } from "@tauri-apps/api/path";

export async function saveMediaToMachine(
  params: MediaSaveParams,
): Promise<MediaSaveResponse> {
  const db = await openDb();

  const id = mkid();

  await mkdir(`_gallery/${id}`, {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });

  const bytes = new Uint8Array(await params.file.arrayBuffer());

  await writeFile(`_gallery/${id}/item`, bytes, {
    baseDir: BaseDirectory.AppData,
  });

  if (params.file.type.startsWith("video/")) {
    const appDataPath = await appDataDir();
    const thumbnailBlob = await getVideoThumbnail(
      convertFileSrc(`${appDataPath}/_gallery/${id}/item`),
    );
    if (thumbnailBlob) {
      const thumbnailBytes = new Uint8Array(await thumbnailBlob.arrayBuffer());
      await writeFile(`_gallery/${id}/thumbnail.jpg`, thumbnailBytes, {
        baseDir: BaseDirectory.AppData,
      });
    }
  }

  await db.execute(
    "INSERT INTO media (id, type, extension, size, title) VALUES (?, ?, ?, ?, ?)",
    [
      id,
      params.file.type,
      getExtension(params.automaticTitle),
      params.file.size,
      params.automaticTitle,
    ],
  );

  return { id };
}

function getExtension(automaticTitle: string | null) {
  const extension = automaticTitle?.includes(".")
    ? automaticTitle.split(".").splice(-1)[0].trim().toLowerCase() || null
    : null;

  if (!extension) return null;
  if (!/^[a-z0-9_-]+$/.test(extension)) return null;
  if (extension === "jpeg") return "jpg";
  return extension;
}
