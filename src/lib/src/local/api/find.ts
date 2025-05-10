import type { MediaFindParams, MediaFindResponse } from "$lib/src/api/find";
import type { MediaItem } from "$lib/types/Media";
import { openDb } from "$lib/src/local/imports/db";
import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, BaseDirectory } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";

type DbFile = {
  id: string;
  type: string;
  extension: string;
  size: number;
  title: string | null;
  createdAt: string;
};

export async function findMediaOnMachine(
  params: MediaFindParams,
): Promise<MediaFindResponse> {
  const db = await openDb();

  const POSSIBLE_MODIFIERS = ["sort", "order", "id", "title", "ext", "mime"];

  const tags = params.keywords.filter(
    (i) => !POSSIBLE_MODIFIERS.includes(i.split(":")[0]),
  );
  const modifiers: Map<string, string> = new Map(
    params.keywords
      .filter(
        (i) => i.includes(":") && POSSIBLE_MODIFIERS.includes(i.split(":")[0]),
      )
      .map(
        (i) =>
          i
            .split(":")
            .slice(0, 2)
            .map((i) => i.trim()) as [string, string],
      ),
  );

  const orderBy =
    (modifiers.get("sort") || modifiers.get("order"))?.replaceAll(" ", "_") ===
    "date_asc"
      ? "createdAt ASC"
      : "createdAt DESC";

  const modifierList = getModifierList(modifiers);

  const whereString = modifierList.map((i) => i.whereTemplate).join(" AND ");
  const whereEscapes = modifierList
    .flatMap((i) => i.value)
    .filter((i) => i !== null);

  const items: DbFile[] = await db.select(
    `SELECT m.*
      FROM media m
      LEFT JOIN media_tags mt ON m.id = mt.media_id
      LEFT JOIN tags t ON t.id = mt.tag_id
      WHERE ${tags.length !== 0 ? `t.name IN (${tags.map(() => "?").join(", ")}) AND` : ""}
      ${whereString}
      GROUP BY m.id
      ${tags.length !== 0 ? "HAVING COUNT(DISTINCT t.name) = ?" : ""}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?`,
    [
      ...(tags.length !== 0 ? tags : []),
      ...whereEscapes,
      ...(tags.length !== 0 ? [tags.length] : []),
      params.limit,
      params.page * params.limit,
    ],
  );

  const appDataPath = await appDataDir();
  const mediaItems: MediaItem[] = [];
  for (const item of items) {
    const src = convertFileSrc(`${appDataPath}/_gallery/${item.id}/item`);
    const thumbnail = (await exists(`_gallery/${item.id}/thumbnail.jpg`, {
      baseDir: BaseDirectory.AppData,
    }))
      ? convertFileSrc(`${appDataPath}/_gallery/${item.id}/thumbnail.jpg`)
      : null;
    mediaItems.push({
      id: item.id,
      type: item.type,
      extension: item.extension,
      size: item.size,
      title: item.title,
      src,
      thumbnailSrc: item.type.startsWith("image/") ? src : thumbnail || null,
      tags: await getMediaTags(item.id),
      createdAt: new Date(item.createdAt),
    });
  }

  return { items: mediaItems };
}

async function getMediaTags(id: string) {
  const db = await openDb();

  const items: { name: string }[] = await db.select(
    `
    SELECT name
      FROM tags t
      JOIN media_tags mt
        ON t.id = mt.tag_id
    WHERE mt.media_id = ?
    ORDER BY mt.createdAt ASC
    LIMIT 50
  `,
    [id],
  );

  return items.map((i) => i.name);
}

function getModifierList(filters: Map<string, string>) {
  const filterList: {
    whereTemplate: string;
    value: string | string[] | null;
  }[] = [];

  if (filters.get("id"))
    filterList.push({
      whereTemplate: "m.id = ?",
      value: filters.get("id") as string,
    });
  if (filters.get("title"))
    filterList.push({
      whereTemplate: "m.title = ?",
      value: filters.get("title") as string,
    });
  if (filters.get("ext"))
    filterList.push({
      whereTemplate: "m.extension = ?",
      value: filters.get("ext") as string,
    });
  if (filters.get("mime"))
    // "mime" (modifier) = "type" (db)
    filterList.push({
      whereTemplate: "m.type = ?",
      value: filters.get("mime") as string,
    });
  if (filterList.length === 0)
    filterList.push({ whereTemplate: "1 = 1", value: null });

  return filterList;
}
