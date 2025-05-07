<script lang="ts">
  import type { MediaItem } from "$lib/types/Media";
  import ImageDemo from "$lib/components/adaptable/ImageDemo.svelte";
  import { onDestroy, onMount } from "svelte";
  import MediaModal from "../media/MediaModal.svelte";
  import { findMediaOnMachine } from "$lib/src/local/api/find";
  import type { MediaEditResponse } from "$lib/src/api/edit";
  import { page } from "$app/state";
  import { windowState } from "$lib/data/state/windowState.svelte";
  import BackIcon from "~icons/material-symbols/arrow-left-alt-rounded";
  import ForwardIcon from "~icons/material-symbols/arrow-right-alt-rounded";
  import clsx from "clsx";

  interface Props {
    keywords: string[];
    pageNumber?: number;
    limit?: number;
    onswitchpage?: (num: number) => void;
  }

  let {
    keywords,
    pageNumber = 0,
    limit = 50,
    onswitchpage = () => null,
  }: Props = $props();

  const MIN_COL_WIDTH = 200;
  const MAX_COLS = 8;

  let mediaItems: MediaItem[] = $state([]);

  let mediaModalActive = $state(false);
  let currentMediaItem: MediaItem | null = $state(null);

  let columnCount = $derived.by(() => {
    const possible = Math.floor(windowState.width / MIN_COL_WIDTH);
    return Math.min(Math.max(possible, 1), MAX_COLS);
  });

  onMount(async () => {
    if (typeof window === "undefined") return;

    await reloadMediaItems(keywords);
    if (page.url.searchParams.get("autoOpen") === "1")
      openMediaItem(mediaItems[0]);
  });

  function openMediaItem(mediaItem: MediaItem) {
    currentMediaItem = mediaItem;
    mediaModalActive = true;
  }

  async function reloadMediaItems(keywords: string[] = []) {
    const resp = await findMediaOnMachine({
      keywords: keywords,
      page: pageNumber,
      limit,
    });
    mediaItems.push(...resp.items);
  }

  function onEditMediaItem(id: string, response: MediaEditResponse) {
    const i = mediaItems.findIndex((i) => i.id === id);
    if (i === -1) return;

    if (response.fields.title) {
      mediaItems[i].title = response.fields.title;
    } else if (response.fields.tags) {
      mediaItems[i].tags = response.fields.tags;
    }
  }

  function onDeleteMediaItem(id: string) {
    const i = mediaItems.findIndex((i) => i.id === id);
    if (i === -1) return;

    mediaItems.splice(i, 1);
  }
</script>

<MediaModal
  mediaItem={currentMediaItem}
  onedit={onEditMediaItem}
  ondelete={onDeleteMediaItem}
  bind:active={mediaModalActive}
/>

<div class="ls-fade-in relative min-h-full w-full overflow-x-hidden pb-16">
  <div
    class="grid gap-2 p-2"
    style="grid-template-columns: repeat({columnCount}, 1fr);"
  >
    {#each mediaItems as mediaItem}
      <button
        class="ls-grow-in bg-panel hover:shadow-main relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all duration-200 ease-in-out hover:z-30 hover:scale-105 active:scale-100"
        aria-label="View media item"
        onclick={() => openMediaItem(mediaItem)}
      >
        <ImageDemo src={mediaItem.thumbnailSrc} />
      </button>
    {/each}
  </div>

  <div
    class="absolute bottom-0 flex h-16 w-full items-center justify-center gap-2 px-2"
  >
    <button
      class={clsx("bg-panel gs-icon-button", {
        "pointer-events-none opacity-50": pageNumber === 0,
      })}
      aria-label="Previous Page"
      tabindex={pageNumber === 0 ? -1 : 0}
      onclick={() => onswitchpage(pageNumber - 1)}
    >
      <BackIcon />
    </button>

    <div class="px-2">
      <p class="text-alt">
        Page <span class="font-semibold">{pageNumber + 1}</span>
      </p>
    </div>

    <button
      class={clsx("bg-panel gs-icon-button", {
        "pointer-events-none opacity-50": mediaItems.length < limit,
      })}
      aria-label="Next Page"
      tabindex={mediaItems.length < limit ? -1 : 0}
      onclick={() => onswitchpage(pageNumber + 1)}
    >
      <ForwardIcon />
    </button>
  </div>
</div>

<style>
  .ls-fade-in {
    animation: fade-in 0.3s 0.1s forwards;
    opacity: 0;
  }

  @keyframes fade-in {
    to {
      opacity: 1;
    }
  }
</style>
