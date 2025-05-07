<script lang="ts">
  import { runPrepare } from "$lib/src/local/prepare";
  import { onMount } from "svelte";
  import "../app.css";
  import "@fontsource/nunito/800.css";
  import Preparing from "$lib/components/functional/layout/Preparing.svelte";

  let { children } = $props();

  let prepDone = $state(false);

  onMount(async () => {
    await runPrepare();
    prepDone = true;
  });
</script>

{#if prepDone}
  {@render children()}
{:else}
  <Preparing />
{/if}
