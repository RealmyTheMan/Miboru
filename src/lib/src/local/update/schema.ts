import { openDb } from "$lib/src/local/imports/db";
import { openStore } from "$lib/src/local/imports/store";
import type Database from "@tauri-apps/plugin-sql";
import type { Store } from "@tauri-apps/plugin-store";

export type VersionString = `${number}.${number}.${number}`;
export type MigrationFunction = (db: Database, store: Store) => Promise<any>;
type MigrationSchemaObject = Record<VersionString, MigrationFunction>;

function compareVersions(a: VersionString, b: VersionString): number {
  const [aMaj, aMin, aPatch] = a.split(".").map(Number);
  const [bMaj, bMin, bPatch] = b.split(".").map(Number);

  if (aMaj !== bMaj) return aMaj - bMaj;
  if (aMin !== bMin) return aMin - bMin;
  return aPatch - bPatch;
}

class MigrationError extends Error {
  failedMigration: VersionString = "0.0.0";
  originalError: any;

  constructor(
    message: string,
    failedMigration: VersionString,
    originalError: any,
  ) {
    super(message);
    this.name = "Miboru:MigrationError";
    this.failedMigration = failedMigration;
    this.originalError = originalError;
  }
}

export class MigrationSchema {
  static Error = MigrationError;

  #schema: MigrationSchemaObject = {};

  /**
   * @param schema The functions that get ran to migrate the user to the latest update.
   */
  constructor(schema: MigrationSchemaObject) {
    this.#schema = schema;
  }

  async run(oldVersion: VersionString) {
    const db = await openDb();
    const store = await openStore();
    const versions = (Object.keys(this.#schema) as VersionString[])
      .sort(compareVersions)
      .filter((v) => compareVersions(v, oldVersion) > 0);

    for (const version of versions) {
      try {
        await this.#schema[version](db, store);
      } catch (err) {
        throw new MigrationError(
          `Error running migration "${version}"`,
          version,
          err,
        );
      }
    }

    return { migrationsRan: versions };
  }
}
