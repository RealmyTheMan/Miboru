<script lang="ts">
  import type { MediaItem } from "$lib/types/Media";
  import ImageDemo from "$lib/components/adaptable/ImageDemo.svelte";
  import { typeMap } from "$lib/types/typeMap";

  interface Props {
    item: MediaItem;
  }

  let { item }: Props = $props();

  let typeMapItem = $derived(typeMap[item.type.split("/")[0]] || null);
</script>

{#if item.thumbnailSrc}
  <ImageDemo src={item.thumbnailSrc} />
{:else}
  <div class="relative h-full w-full">
    <div
      class="text-accent-red absolute top-1/2 left-1/2 z-1 -translate-1/2 text-5xl"
    >
      <typeMapItem.icon />
    </div>
    <div
      class="bg-accent-red absolute top-0 left-0 z-0 h-full w-full opacity-25"
    ></div>
  </div>
{/if}
