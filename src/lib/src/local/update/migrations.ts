import { version } from "$app/environment";
import { openDb } from "$lib/src/local/imports/db";
import { openStore } from "$lib/src/local/imports/store";
import { dbInit, dbMigrations } from "$lib/src/local/update/db";
import type { VersionString } from "$lib/src/local/update/schema";
import { fsMigrations } from "./fs";

export async function runUpdateMigrations() {
  const db = await openDb();
  const store = await openStore();

  const oldVersion: VersionString | undefined = await store.get("appVersion");

  if (!oldVersion) {
    await dbInit(db, store);
    console.info("Ran initial migration.");
  } else {
    const { migrationsRan: dbMigrationsRan } =
      await dbMigrations.run(oldVersion);
    const { migrationsRan: fsMigrationsRan } =
      await fsMigrations.run(oldVersion);
    console.info("Ran DB migrations:", dbMigrationsRan);
    console.info("Ran FS migrations:", fsMigrationsRan);
  }

  await store.set("appVersion", version);

  const resp: { answer: 2 }[] = await db.select("SELECT (1 + 1) AS answer");
  if (resp[0].answer === 2) console.info("Database works!");
}
