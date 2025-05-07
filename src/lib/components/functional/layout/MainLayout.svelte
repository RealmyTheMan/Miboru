<script lang="ts">
  import { page } from "$app/state";
  import Button from "$lib/components/adaptable/Button.svelte";
  import MenuButton from "$lib/components/adaptable/MenuButton.svelte";
  import AddModal from "$lib/components/functional/media/AddModal.svelte";
  import GalleryIcon from "~icons/material-symbols/image-rounded";
  import SettingsIcon from "~icons/material-symbols/settings-rounded";
  import UploadIcon from "~icons/material-symbols/upload-file-rounded";
  import SearchIcon from "~icons/material-symbols/search-rounded";
  import SearchModal from "../gallery/SearchModal.svelte";
  import clsx from "clsx";
  import { deriveTags } from "$lib/data/state/tags.svelte";
  import SyncToastOverlay from "./SyncToastOverlay.svelte";

  let { children } = $props();

  let addModalActive = $state(false);
  let searchModalActive = $state(false);

  let keywords = $derived.by(deriveTags);
</script>

<AddModal bind:active={addModalActive} />
<SearchModal bind:active={searchModalActive} />

<SyncToastOverlay />

<div class="grid h-full w-full grid-rows-[auto_1fr] overflow-hidden">
  <header
    class="border-b-main relative grid h-16 grid-cols-[auto_1fr_auto] items-center justify-between gap-2 border-b px-2"
  >
    <div class="px-2">
      <h1 class="ls-miboru text-2xl font-semibold">
        miboru<span class="text-accent-red">!</span><span
          class="text-accent-pink">!</span
        ><span class="text-accent-purple">!</span>
      </h1>
    </div>

    <div class="w-full overflow-hidden">
      <button
        class={clsx(
          "bg-panel-alt relative flex h-12 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-full px-4 text-nowrap transition-all hover:opacity-85 active:opacity-65",
        )}
        aria-label="Search your images"
        onclick={() => (searchModalActive = true)}
      >
        <span class="text-lg"><SearchIcon /></span>

        {#if keywords.length === 0}
          <span class="font-medium">Search</span>
        {:else}
          <div class="flex items-center gap-1">
            {#each keywords as keyword}
              <span class="bg-highlight rounded-full px-3 py-1 font-medium"
                >{keyword}</span
              >
            {/each}
          </div>
        {/if}

        <div
          class="absolute top-0 right-0 h-full w-32"
          style="background-image:linear-gradient(90deg, transparent, var(--background-color-panel-alt))"
        ></div>
      </button>
    </div>

    <div class="">
      <Button
        icon={UploadIcon}
        label="Add Media"
        onclick={() => (addModalActive = true)}
      />
    </div>
  </header>

  <div class="grid h-full grid-cols-[auto_1fr] overflow-hidden">
    <div class="border-r-main flex w-48 flex-col justify-between border-r py-4">
      <div class="">
        <MenuButton
          icon={GalleryIcon}
          label="Gallery"
          active={page.url.pathname === "/gallery"}
          href="/gallery"
        />

        <MenuButton
          icon={SettingsIcon}
          label="Settings"
          active={page.url.pathname === "/settings"}
          href="/settings"
        />
      </div>
    </div>

    <div class="h-full overflow-auto">
      {@render children()}
    </div>
  </div>
</div>
