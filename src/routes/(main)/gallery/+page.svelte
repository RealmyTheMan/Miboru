<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import MediaGallery from "$lib/components/functional/gallery/MediaGallery.svelte";
  import { deriveTags } from "$lib/data/state/tags.svelte";

  let keywords = $derived.by(deriveTags);
  let pageNumber = $derived(Number(page.url.searchParams.get("page")) || 0);
</script>

{#key keywords || pageNumber}
  <MediaGallery
    {keywords}
    {pageNumber}
    onswitchpage={(number) =>
      goto(
        `/gallery?keywords=${encodeURIComponent(JSON.stringify(keywords))}&page=${number}`,
      )}
  />
{/key}
