<script lang="ts">
  interface Props {
    src: string;
    alt?: string;
  }

  let { src, alt = "An image preview" }: Props = $props();
</script>

<div class="relative h-full w-full overflow-hidden" role="img" aria-label={alt}>
  <div
    class="absolute top-0 left-0 z-20 h-full w-full bg-contain bg-center bg-no-repeat"
    style="background-image:url({src})"
  ></div>

  <div
    class="absolute top-1/2 left-1/2 z-10 h-full w-full -translate-1/2 scale-110 bg-cover bg-center opacity-80 blur-md"
    style="background-image:url({src})"
  ></div>
</div>
