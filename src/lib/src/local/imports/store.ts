import { load, Store } from "@tauri-apps/plugin-store";

let storeInstance: Store | null = null;

/**
 * Either opens or returns the already opened store instance.
 * This is a workaround for a WebKit-related bug that makes using top-level await impossible.
 */
export async function openStore() {
  if (!storeInstance) storeInstance = await load("store.json");
  return storeInstance;
}
