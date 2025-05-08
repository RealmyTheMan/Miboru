<script lang="ts">
  import clsx from "clsx";
  import CloseIcon from "~icons/material-symbols/close-rounded";
  import { onMount, type Snippet } from "svelte";
  import { trapFocus } from "$lib/util/trapFocus";

  interface Props {
    children: Snippet;
    active: boolean;
    layer?: number;
    float?: "center" | "top";
    showClose?: boolean;
    onopen?: () => void;
    onescape?: () => void;
  }

  let {
    children,
    active = $bindable(),
    layer = 0,
    float = "center",
    showClose = true,
    onopen,
    onescape = () => (active = false),
  }: Props = $props();

  let renderChildren = $state(false);
  let busyTimeout: number | null = $state(null);

  let modalRef: HTMLDivElement | null = $state(null);

  const keyDownEvent = (e: KeyboardEvent) => {
    if (e.key === "Escape") onescape();
  };

  $effect(() => {
    if (active === true) {
      onModalActive();
    } else {
      onModalInactive();
      busyTimeout = setTimeout(() => {
        renderChildren = false;
        busyTimeout = null;
      }, 200);
    }
  });

  function onModalActive() {
    renderChildren = true;
    if (busyTimeout) clearTimeout(busyTimeout);
    window.addEventListener("keydown", keyDownEvent);

    setTimeout(() => {
      if (!modalRef) return;
      modalRef.focus();
    }, 0);

    onopen?.();
  }

  function onModalInactive() {
    window.removeEventListener("keydown", keyDownEvent);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={clsx(
    "fixed top-0 left-0 flex h-full w-full justify-center overflow-hidden transition-all duration-200 sm:p-2",
    {
      "pointer-events-none opacity-0": !active,
      "pointer-events-auto opacity-100": active,
      "items-center": float === "center",
      "items-start": float === "top",
    },
  )}
  style="background-color:rgba(0,0,0,0.75);z-index:{100 + layer}"
  tabindex="-1"
  onclick={() => (active = false)}
  use:trapFocus
>
  {#if showClose && renderChildren}
    <div
      class="border-b-main absolute top-0 left-0 z-110 flex h-14 w-full items-center justify-end border-b p-3 sm:pointer-events-none sm:border-b-0"
    >
      <button
        onclick={(e) => {
          e.stopPropagation();
          active = false;
        }}
        class={clsx(
          "hover:bg-button cursor-pointer rounded-full p-1 text-xl transition-all active:opacity-85",
          {
            "pointer-events-auto": active,
          },
        )}
        aria-label="Close Modal"
        tabindex={active ? 0 : -1}><CloseIcon /></button
      >
    </div>
  {/if}

  <div
    class={clsx(
      "bg-panel shadow-main h-full w-full overflow-auto pt-14 transition-all duration-200 outline-none sm:h-auto sm:max-h-full sm:max-w-[50vw] sm:min-w-xl sm:rounded-lg sm:pt-0",
      { "scale-90": !active },
    )}
    role="dialog"
    aria-modal="true"
    tabindex={active ? 0 : -1}
    onclick={(e) => e.stopPropagation()}
    bind:this={modalRef}
  >
    {#if renderChildren}{@render children()}{/if}
  </div>
</div>
