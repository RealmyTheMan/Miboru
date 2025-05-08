<script lang="ts">
  import { trapFocus } from "$lib/util/trapFocus";
  import clsx from "clsx";
  import { onDestroy, type Snippet } from "svelte";

  interface Props {
    class?: string;
    active: boolean;
    children: Snippet;
  }

  let { class: className, active = $bindable(), children }: Props = $props();

  let expandBoxRef: HTMLDivElement | null = $state(null);

  const clickListener = (e: MouseEvent) => {
    // workaround for not being able to click modals to close the context menu (on top of a modal) due to e.stopPropagation
    if (expandBoxRef && !expandBoxRef.contains(e.target as Node)) {
      active = false;
    }
  };
  const keyDownListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      active = false;
    }
  };

  $effect(() => {
    if (typeof window === "undefined") return;
    if (active) onExpandBoxActive();
    else if (!active) onExpandBoxInactive();
  });

  onDestroy(() => {
    onExpandBoxInactive();
  });

  function onExpandBoxActive() {
    expandBoxRef?.focus();
    window.addEventListener("mousedown", clickListener, true);
    window.addEventListener("keydown", keyDownListener, true);
  }

  function onExpandBoxInactive() {
    window.removeEventListener("mousedown", clickListener, true);
    window.removeEventListener("keydown", keyDownListener, true);
  }
</script>

{#if active}
  <div
    class={clsx(
      "bg-panel-alt shadow-main absolute z-1000 rounded-lg",
      className,
    )}
    role="menu"
    aria-label="Options"
    tabindex="0"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => {
      if (e.key === "Escape") active = false;
    }}
    use:trapFocus
    bind:this={expandBoxRef}
  >
    {@render children()}
  </div>
{/if}
