import { ENVIRONMENT } from "$lib/data/const";
import { runUpdateMigrations } from "$lib/src/local/update/migrations";

/** Function that prepares the app for use. */
export async function runPrepare() {
  if (ENVIRONMENT === "desktop") await runUpdateMigrations();
}
