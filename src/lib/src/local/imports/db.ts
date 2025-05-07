import Database from "@tauri-apps/plugin-sql";

let dbInstance: Database | null = null;

/**
 * Either opens or returns the already opened database instance.
 * This is a workaround for a WebKit-related bug that makes using top-level await impossible.
 */
export async function openDb() {
  if (!dbInstance) dbInstance = await Database.load("sqlite:miboru.db");
  return dbInstance;
}
