<script lang="ts">
  import { windowState } from "$lib/data/state/windowState.svelte";
  import { trapFocus } from "$lib/util/trapFocus";
  import { onDestroy, onMount, type Snippet } from "svelte";
  import { stopPropagation } from "svelte/legacy";

  interface Props {
    coordinates: [number, number] | null;
    children: Snippet;
  }

  let { coordinates = $bindable(null), children }: Props = $props();

  let floatBoxRef: HTMLDivElement | null = $state(null);

  let xCoordinate = $derived(coordinates ? coordinates[0] + 1 : 0);
  let yCoordinate = $derived(coordinates ? coordinates[1] + 1 : 0);
  let clientWidth = $derived.by(() =>
    floatBoxRef ? floatBoxRef.clientWidth : 0,
  );
  let clientHeight = $derived.by(() =>
    floatBoxRef ? floatBoxRef.clientHeight : 0,
  );
  let xPosition = $derived(
    xCoordinate > windowState.width - clientWidth - 8
      ? windowState.width - clientWidth - 8
      : xCoordinate,
  );
  let yPosition = $derived(
    yCoordinate > windowState.height - clientHeight - 8
      ? windowState.height - clientHeight - 8
      : yCoordinate,
  );

  const clickListener = (e: MouseEvent) => {
    // workaround for not being able to click modals to close the context menu (on top of a modal) due to e.stopPropagation
    if (floatBoxRef && !floatBoxRef.contains(e.target as Node)) {
      coordinates = null;
    }
  };
  const keyDownListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      coordinates = null;
    }
  };

  $effect(() => {
    if (typeof window === "undefined") return;
    if (coordinates) onFloatBoxActive();
    else if (!coordinates) onFloatBoxInactive();
  });

  onDestroy(() => {
    onFloatBoxInactive();
  });

  function onFloatBoxActive() {
    floatBoxRef?.focus();
    window.addEventListener("click", clickListener, true);
    window.addEventListener("keydown", keyDownListener, true);
  }

  function onFloatBoxInactive() {
    window.removeEventListener("click", clickListener, true);
    window.removeEventListener("keydown", keyDownListener, true);
  }
</script>

{#if coordinates}
  <div
    class="bg-panel-alt shadow-main fixed z-1000 rounded-lg"
    style="top:{yPosition}px;left:{xPosition}px"
    role="menu"
    aria-label="Options"
    tabindex="0"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => {
      if (e.key === "Escape") coordinates = null;
    }}
    use:trapFocus
    bind:this={floatBoxRef}
  >
    {@render children()}
  </div>
{/if}
