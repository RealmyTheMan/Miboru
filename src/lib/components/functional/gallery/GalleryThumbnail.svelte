<script lang="ts">
  import type { MediaItem } from "$lib/types/Media";
  import ImageDemo from "$lib/components/adaptable/ImageDemo.svelte";
  import { typeMap } from "$lib/types/typeMap";
  import UnknownIcon from "~icons/material-symbols/indeterminate-question-box-rounded";

  interface Props {
    item: MediaItem;
  }

  let { item }: Props = $props();

  let typeMapItem = $derived(typeMap[item.type.split("/")[0]] || null);
</script>

<div class="relative h-full w-full">
  {#if item.thumbnailSrc}
    <ImageDemo src={item.thumbnailSrc} />
    {#if typeMapItem}
      <div class="absolute right-3 bottom-3 z-10 text-xl text-white">
        <typeMapItem.icon />
      </div>
    {/if}
  {:else}
    <div
      class="absolute top-1/2 left-1/2 z-1 -translate-1/2 text-5xl"
      style="color:var(--color-accent-{typeMapItem?.color || 'none'}, #FFF)"
    >
      {#if typeMapItem}<typeMapItem.icon />{:else}<UnknownIcon />{/if}
    </div>
    <div
      class="absolute top-0 left-0 z-0 h-full w-full opacity-25"
      style="background-color:var(--color-accent-{typeMapItem?.color ||
        'none'}, #FFF)"
    ></div>
  {/if}
</div>
