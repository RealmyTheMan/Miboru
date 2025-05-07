<script lang="ts">
  import Spinner from "$lib/components/adaptable/Spinner.svelte";
</script>

<div
  class="flex h-full w-full flex-col items-center justify-center text-center"
>
  <p class="text-center text-lg font-semibold">Preparing Miboru...</p>

  <div class="mt-4 text-xl">
    <Spinner />
  </div>
</div>
