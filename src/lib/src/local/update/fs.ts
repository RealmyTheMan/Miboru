import { openDb } from "$lib/src/local/imports/db";
import { MigrationSchema } from "$lib/src/local/update/schema";
import {
  BaseDirectory,
  copyFile,
  exists,
  mkdir,
  readDir,
  remove,
  rename,
} from "@tauri-apps/plugin-fs";

export const fsMigrations = new MigrationSchema({
  "0.1.1": async () => {
    // moves "_gallery" to "gallery", and moves everything to use subdivided folders
    await rename("_gallery", "gallery", {
      oldPathBaseDir: BaseDirectory.AppData,
      newPathBaseDir: BaseDirectory.AppData,
    });
    const mediaItemDirs = (
      await readDir("gallery", { baseDir: BaseDirectory.AppData })
    ).filter((i) => i.isDirectory === true);

    for (const mediaItemDir of mediaItemDirs) {
      const oldPath = `gallery/${mediaItemDir.name}`;
      const newPath = `gallery/${mediaItemDir.name.slice(0, 2)}/${mediaItemDir.name.slice(2, 4)}/${mediaItemDir.name}`;
      await mkdir(newPath, { baseDir: BaseDirectory.AppData, recursive: true });

      await copyFile(`${oldPath}/item`, `${newPath}/item`, {
        fromPathBaseDir: BaseDirectory.AppData,
        toPathBaseDir: BaseDirectory.AppData,
      });
      if (
        await exists(`${oldPath}/thumbnail.jpg`, {
          baseDir: BaseDirectory.AppData,
        })
      )
        await copyFile(`${oldPath}/thumbnail.jpg`, `${newPath}/thumbnail.jpg`, {
          fromPathBaseDir: BaseDirectory.AppData,
          toPathBaseDir: BaseDirectory.AppData,
        });

      await remove(oldPath, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }
  },
});
