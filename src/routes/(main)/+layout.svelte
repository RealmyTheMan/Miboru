<script lang="ts">
  import MainLayout from "$lib/components/functional/layout/MainLayout.svelte";

  let { children } = $props();
</script>

<MainLayout>
  {@render children()}
</MainLayout>
