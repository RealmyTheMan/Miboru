<script lang="ts">
  import ImageDemo from "$lib/components/adaptable/ImageDemo.svelte";
  import clsx from "clsx";

  interface Props {
    active: boolean;
    src: string;
    alt?: string;
  }

  let { active = $bindable(), src, alt }: Props = $props();

  const keydownListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      active = false;
    }
  };

  $effect(() => {
    if (active) onActive();
    else onInactive();
  });

  function onActive() {
    window.addEventListener("keydown", keydownListener, true);
  }

  function onInactive() {
    window.removeEventListener("keydown", keydownListener, true);
  }
</script>

<button
  class={clsx(
    "bg-panel fixed top-0 left-0 z-200 h-full w-full cursor-zoom-out transition-all duration-300",
    {
      "pointer-events-auto opacity-100": active,
      "pointer-events-none scale-90 opacity-0": !active,
    },
  )}
  aria-label="Close maximized image"
  tabindex={active ? 0 : -1}
  onclick={() => (active = false)}
>
  <ImageDemo {src} {alt} />
</button>
