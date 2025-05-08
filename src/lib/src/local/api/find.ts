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

  const processedKeywords = params.keywords.map((i) => i.replaceAll("_", " "));
  const tags = processedKeywords.filter((i) => !i.includes(":"));
  const filters = processedKeywords.filter((i) => i.includes(":"));

  const order = filters.includes("order:date asc")
    ? "createdAt ASC"
    : "createdAt DESC";

  const idFilter = filters.find((i) => i.startsWith("id:"));

  const filterList: { whereTemplate: string; value: string | null }[] = [
    { whereTemplate: "1 = 1", value: null },
    ...(idFilter
      ? [{ whereTemplate: "m.id = ?", value: idFilter.split("id:")[1].trim() }]
      : []),
  ];

  const filterWhereString = filterList
    .map((i) => i.whereTemplate)
    .join(" AND ");
  const filterEscapes = filterList
    .map((i) => i.value)
    .filter((i) => i !== null);

  let items: DbFile[] = [];

  if (tags.length !== 0) {
    items = await db.select(
      `SELECT m.*
      FROM media m
      JOIN media_tags mt ON m.id = mt.media_id
      JOIN tags t ON t.id = mt.tag_id
      WHERE t.name IN (${tags.map(() => "?").join(", ")})
      AND ${filterWhereString}
      GROUP BY m.id
      HAVING COUNT(DISTINCT t.name) = ?
      ORDER BY ${order}
      LIMIT ? OFFSET ?`,
      [
        ...tags,
        ...filterEscapes,
        tags.length,
        params.limit,
        params.page * params.limit,
      ],
    );
  } else {
    items = await db.select(
      `SELECT m.*
      FROM media m
      WHERE ${filterWhereString}
      ORDER BY ${order}
      LIMIT ? OFFSET ?`,
      [...filterEscapes, params.limit, params.page * params.limit],
    );
  }

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
