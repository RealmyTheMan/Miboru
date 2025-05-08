<script lang="ts">
  import { goto } from "$app/navigation";
  import clsx from "clsx";
  import type { Component } from "svelte";

  interface MenuItem {
    icon?: Component;
    label: string;
    active?: boolean;
    href?: string;
    onclick?: (e: MouseEvent) => void;
  }
  interface Props {
    items: MenuItem[];
    onclose: () => void;
  }

  let { items, onclose }: Props = $props();
</script>

{#snippet button(item: MenuItem)}
  <button
    class={clsx(
      "hover:bg-button flex min-w-48 cursor-pointer items-center gap-2 rounded-md p-2 transition-all active:opacity-65",
      {
        "bg-accent-blue": item.active,
      },
    )}
    role="menuitem"
    onclick={(e) => {
      onclose();
      if (item.href) goto(item.href); // i dont know why i need to do this but for some reason i do (it refreshes the entire page if its a link)
      item.onclick?.(e);
    }}
  >
    {#if item.icon}<div class=""><item.icon /></div>{/if}
    <span class="font-semibold">{item.label}</span>
  </button>
{/snippet}

<div class="grid gap-2 p-2" role="menu">
  {#each items as item}
    {@render button(item)}
  {/each}
</div>
