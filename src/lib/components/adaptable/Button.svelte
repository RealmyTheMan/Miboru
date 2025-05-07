<script lang="ts">
  import clsx from "clsx";
  import type { Component } from "svelte";
  import Spinner from "./Spinner.svelte";

  interface Props {
    icon: Component;
    label: string;
    loading?: boolean;
    onclick?: () => void;
    href?: string;
  }

  let { icon: Icon, label, loading = false, onclick, href }: Props = $props();
</script>

{#snippet button()}
  <button
    class={"bg-button flex h-12 w-[inherit] cursor-pointer items-center justify-center rounded-full px-5 transition-all hover:opacity-85 active:opacity-65"}
    {onclick}
  >
    {#if loading}
      <div class="text-xl"><Spinner /></div>
    {:else}
      <div class="text-xl">
        <Icon />
      </div>
      <span class="ml-2 font-semibold">{label}</span>
    {/if}
  </button>
{/snippet}

{#if href}
  <a {href}>{@render button()}</a>
{:else}
  {@render button()}
{/if}
