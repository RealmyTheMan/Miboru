<script lang="ts">
  import Spinner from "$lib/components/adaptable/Spinner.svelte";
  import { syncing } from "$lib/data/store/sync";
  import { removeToast, toastsStore } from "$lib/data/store/toast";
  import clsx from "clsx";
  import ErrorIcon from "~icons/material-symbols/error-rounded";
  import CloseIcon from "~icons/material-symbols/close-small-rounded";
</script>

<!-- Syncs -->
<div
  class={clsx(
    "pointer-events-none fixed top-3 left-3 z-900 flex h-6 items-center gap-2 opacity-0 duration-300",
    { "opacity-100": $syncing },
  )}
>
  <span class="text-lg"><Spinner /></span>
  <span class="font-medium">{$syncing?.message}</span>
</div>

<!-- Toasts -->
<div
  class="pointer-events-none fixed right-3 bottom-3 z-900 flex h-full w-72 flex-col justify-end gap-2"
>
  {#each $toastsStore as toast}
    <div
      class={clsx(
        "ls-toast bg-panel-alt shadow-main pointer-events-auto relative grid grid-cols-[1fr_auto] items-center justify-between gap-1 overflow-hidden rounded-lg p-3 pl-4",
      )}
    >
      <div class="flex items-center">
        <div class="text-accent-red mr-2 text-lg"><ErrorIcon /></div>
        <span class="font-medium select-text">{toast.message}</span>
      </div>

      <button
        class="hover:bg-button text-dimmed hover:text-main flex h-8 w-8 items-center justify-center rounded-full text-xl transition-all hover:cursor-pointer"
        aria-label="Close"
        onclick={() => {
          removeToast(toast._id || 0);
        }}
      >
        <CloseIcon />
      </button>

      {#if toast.duration}<div
          class="ls-animate-width bg-accent-red absolute bottom-0 left-0 h-1 w-0"
          style="animation-duration:{toast.duration / 1000}s"
        ></div>{/if}
    </div>
  {/each}
</div>

<style>
  .ls-toast {
    animation: toast-in 0.2s 0.15s forwards;
    opacity: 0;
    transform: translateX(1rem);
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(1rem);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .ls-animate-width {
    animation-name: animate-width;
    animation-timing-function: linear;
  }

  @keyframes animate-width {
    from {
      width: 0%;
    }

    to {
      width: 100%;
    }
  }
</style>
