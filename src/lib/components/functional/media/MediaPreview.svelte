<script lang="ts">
  import "vidstack/bundle";
  import { ENVIRONMENT } from "$lib/data/const";
  import type { MediaItem } from "$lib/types/Media";
  import ImageDemo from "$lib/components/adaptable/ImageDemo.svelte";
  import ImageScreenBox from "./ImageScreenBox.svelte";
  import { save } from "@tauri-apps/plugin-dialog";
  import { openPath } from "@tauri-apps/plugin-opener";
  import { appDataDir } from "@tauri-apps/api/path";
  import Button from "$lib/components/adaptable/Button.svelte";
  import SaveFileIcon from "~icons/material-symbols/sim-card-download-rounded";
  import { copyFile } from "@tauri-apps/plugin-fs";

  interface Props {
    item: MediaItem;
  }

  let { item }: Props = $props();

  let imageScreenBoxActive = $state(false);

  let type = $derived(item.type.split("/")[0] || null);
  let alt = $derived(item.title || "Untitled media");

  async function saveFile() {
    const appDataPath = await appDataDir();

    const path = await save({
      filters: [
        {
          name: alt,
          extensions: [item.extension],
        },
      ],
    });

    if (path) {
      await copyFile(`${appDataPath}/_gallery/${item.id}/item`, path);
      await openPath(path);
    }
  }
</script>

<ImageScreenBox src={item.src} {alt} bind:active={imageScreenBoxActive} />

<div class="h-full bg-black">
  {#if type === "image"}
    <button
      class="h-full w-full cursor-zoom-in"
      aria-label="Maximize image"
      onclick={() => (imageScreenBoxActive = true)}
    >
      <ImageDemo src={item.src} {alt} />
    </button>
  {:else if type === "video"}
    <div class="ls-plyr flex h-full items-center justify-center">
      <media-player title={alt}>
        <media-provider>
          <source src={item.src} type={item.type} />
        </media-provider>
        <media-plyr-layout thumbnails={item.thumbnailSrc}></media-plyr-layout>
      </media-player>
    </div>
  {:else}
    <div class="flex h-full flex-col items-center justify-center text-center">
      <h2 class="text-2xl">This item can't be previewed.</h2>
      {#if ENVIRONMENT === "desktop"}
        <p class="text-alt mt-2">
          However, you can save the file to open it manually.
        </p>
        <div class="mt-4">
          <Button
            icon={SaveFileIcon}
            label="Save File"
            onclick={() => saveFile()}
          />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .ls-plyr {
    --plyr-color-main: var(--color-accent-red);
  }

  .ls-plyr :global(video) {
    width: 100%;
    height: 100%;
  }

  .ls-plyr :global(media-fullscreen-button) {
    display: none;
  }
</style>
