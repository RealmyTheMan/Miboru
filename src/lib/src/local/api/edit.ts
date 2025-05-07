import type { MediaEditParams, MediaEditResponse } from "$lib/src/api/edit";
import { openDb } from "../imports/db";
import { mkid } from "../imports/mkid";

export async function editMediaOnMachine(
  params: MediaEditParams,
): Promise<MediaEditResponse> {
  const db = await openDb();
  const response: MediaEditResponse = { fields: {} };

  if (params.fields.title !== undefined) {
    await db.execute("UPDATE media SET title = ? WHERE id = ?", [
      params.fields.title,
      params.id,
    ]);
    response.fields.title = params.fields.title;
  }

  if (params.fields.tags !== undefined) {
    // TODO: restrict tag names and tag list length
    const newTagList = params.fields.tags;

    const existingTagRows: { id: number; name: string }[] = await db.select(
      `SELECT t.id, t.name
         FROM tags t
         JOIN media_tags mt
           ON t.id = mt.tag_id
        WHERE mt.media_id = ?`,
      [params.id],
    );
    const existingNames = existingTagRows.map((i) => i.name);
    const existingMap = new Map(existingTagRows.map((i) => [i.name, i.id]));

    const toAdd = newTagList.filter((i) => !existingNames.includes(i));
    const toRemove = existingNames.filter((i) => !newTagList.includes(i));

    for (const name of toRemove) {
      const tagId = existingMap.get(name);
      await db.execute(
        `DELETE FROM media_tags
           WHERE media_id = ? AND tag_id = ?`,
        [params.id, tagId],
      );
      await db.execute("UPDATE tags SET count = count - 1 WHERE id = ?", [
        tagId,
      ]);
      await db.execute("DELETE FROM tags WHERE id = ? AND count <= 0", [tagId]);
    }

    for (const name of toAdd) {
      let tagId: string;

      const [existingTag]: { id: string }[] = await db.select(
        "SELECT id FROM tags WHERE name = ?",
        [name],
      );
      if (existingTag) {
        tagId = existingTag.id;
        await db.execute("UPDATE tags SET count = count + 1 WHERE id = ?", [
          tagId,
        ]);
      } else {
        tagId = mkid();
        await db.execute(
          "INSERT INTO tags (id, name, count) VALUES (?, ?, 1)",
          [tagId, name],
        );
      }

      await db.execute(
        "INSERT INTO media_tags (media_id, tag_id) VALUES (?, ?)",
        [params.id, tagId],
      );
    }

    response.fields.tags = params.fields.tags;
  }

  return response;
}
