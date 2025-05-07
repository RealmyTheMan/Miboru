import {
  MigrationSchema,
  type MigrationFunction,
} from "$lib/src/local/update/schema";

export const dbMigrations = new MigrationSchema({});

export const dbInit: MigrationFunction = async (db, store) => {
  await db.execute(`CREATE TABLE media (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`);

  await db.execute(`CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE,
    count INTEGER DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`);

  await db.execute(`CREATE TABLE media_tags (
    media_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (media_id, tag_id),
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );`);

  await db.execute(
    "CREATE INDEX idx_media_tags ON media_tags(tag_id, media_id);",
  );
};
