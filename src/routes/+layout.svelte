<script lang="ts">
  import { runPrepare } from "$lib/src/local/prepare";
  import { onMount } from "svelte";
  import "../app.css";
  import "@fontsource/nunito/800.css";
  import Preparing from "$lib/components/functional/layout/Preparing.svelte";

  let { children } = $props();

  let prepDone = $state(false);

  onMount(async () => {
    window.addEventListener(
      "keydown",
      (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p")
          e.preventDefault();
      },
      true,
    );

    window.addEventListener("drop", (e) => e.preventDefault());

    await runPrepare();
    prepDone = true;
  });
</script>

{#if prepDone}
  {@render children()}
{:else}
  <Preparing />
{/if}
