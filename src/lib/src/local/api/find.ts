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
    (i) => !POSSIBLE_MODIFIERS.includes(i.split(":")[0]) && !i.startsWith("-"),
  );
  const excludeTags = params.keywords
    .filter(
      (i) => !POSSIBLE_MODIFIERS.includes(i.split(":")[0]) && i.startsWith("-"),
    )
    .map((i) => i.slice(1));
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

  const excludeClause =
    excludeTags.length !== 0
      ? `
    AND NOT EXISTS (
      SELECT 1
      FROM media_tags mt2
      JOIN tags t2
        ON t2.id = mt2.tag_id
      WHERE mt2.media_id = m.id
        AND t2.name IN (${excludeTags.map(() => "?").join(",")})
    )
  `.trim()
      : "";

  const items: DbFile[] = await db.select(
    `SELECT m.*
      FROM media m
      LEFT JOIN media_tags mt ON m.id = mt.media_id
      LEFT JOIN tags t ON t.id = mt.tag_id
      WHERE ${whereString}
      ${tags.length !== 0 ? `AND t.name IN (${tags.map(() => "?").join(", ")})` : ""}
      ${excludeClause}
      GROUP BY m.id
      ${tags.length !== 0 ? "HAVING COUNT(DISTINCT t.name) = ?" : ""}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?`,
    [
      ...whereEscapes,
      ...tags,
      ...excludeTags,
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

function getModifierList(modifiers: Map<string, string>) {
  const modifierList: {
    whereTemplate: string;
    value: string | string[] | null;
  }[] = [];

  if (modifiers.get("id"))
    modifierList.push({
      whereTemplate: "m.id = ?",
      value: modifiers.get("id") as string,
    });
  if (modifiers.get("title"))
    modifierList.push({
      whereTemplate: "m.title = ?",
      value: modifiers.get("title") as string,
    });
  if (modifiers.get("ext"))
    modifierList.push({
      whereTemplate: "m.extension = ?",
      value: modifiers.get("ext") as string,
    });
  if (modifiers.get("mime"))
    // "mime" (modifier) = "type" (db)
    modifierList.push({
      whereTemplate: "m.type = ?",
      value: modifiers.get("mime") as string,
    });
  if (modifierList.length === 0)
    modifierList.push({ whereTemplate: "1 = 1", value: null });

  return modifierList;
}
