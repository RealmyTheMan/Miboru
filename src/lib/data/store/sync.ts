import { type Writable, writable } from "svelte/store";

let currentlySyncing = false;
export const syncing: Writable<{ message: string } | null> = writable(null);
const syncQueue: { promise: Promise<any>; message: string }[] = [];

export function addToSyncQueue(promise: Promise<any>, message: string) {
  syncQueue.push({ promise, message });
  recheck();
}

async function recheck() {
  if (currentlySyncing) return;
  currentlySyncing = true;
  let i = 0;
  while (currentlySyncing) {
    const currentItem = syncQueue[i];
    if (!currentItem) break;
    syncing.set({ message: currentItem.message });

    try {
      await currentItem.promise;
    } catch (err) {
      console.error("Error on sync:", err);
    }

    i++;
  }
  currentlySyncing = false;
  syncing.set(null);
}
