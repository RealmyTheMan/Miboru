<script lang="ts">
  import type { Component } from "svelte";

  interface Props {
    items: {
      icon?: Component;
      label: string;
      onclick?: (e: MouseEvent) => void;
    }[];
    coordinates: [number, number] | null;
  }

  let { items, coordinates = $bindable() }: Props = $props();
</script>

<div class="grid gap-2 p-2">
  {#each items as item}
    <button
      class="hover:bg-button flex min-w-48 cursor-pointer items-center gap-2 rounded-md p-2 transition-all active:opacity-65"
      onclick={(e) => {
        coordinates = null;
        item.onclick?.(e);
      }}
    >
      {#if item.icon}<div class=""><item.icon /></div>{/if}
      <span class="font-semibold">{item.label}</span>
    </button>
  {/each}
</div>
