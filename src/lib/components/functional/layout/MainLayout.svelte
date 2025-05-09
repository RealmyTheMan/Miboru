<script lang="ts">
  import Button from "$lib/components/adaptable/Button.svelte";
  import AddModal from "$lib/components/functional/media/AddModal.svelte";
  import SearchModal from "$lib/components/functional/gallery/SearchModal.svelte";
  import clsx from "clsx";
  import { deriveTags } from "$lib/data/state/tags.svelte";
  import SyncToastOverlay from "./SyncToastOverlay.svelte";
  import IconButton from "$lib/components/adaptable/IconButton.svelte";
  import GalleryIcon from "~icons/material-symbols/gallery-thumbnail-rounded";
  import SettingsIcon from "~icons/material-symbols/settings-rounded";
  import UploadIcon from "~icons/material-symbols/upload-file-rounded";
  import SearchIcon from "~icons/material-symbols/search-rounded";
  import MenuIcon from "~icons/material-symbols/menu-rounded";
  import ContextMenu from "$lib/components/adaptable/ContextMenu.svelte";
  import ExpandBox from "$lib/components/adaptable/ExpandBox.svelte";
  import { page } from "$app/state";
  import Logo from "$lib/components/visual/Logo.svelte";

  let { children } = $props();

  let addModalActive = $state(false);
  let searchModalActive = $state(false);

  let keywords = $derived.by(deriveTags);

  let mainMenuActive = $state(false);
</script>

<AddModal bind:active={addModalActive} />
<SearchModal bind:active={searchModalActive} />

<SyncToastOverlay />

<!-- Main layout content -->
<div class="grid h-full w-full grid-rows-[auto_1fr] overflow-hidden">
  <header
    class="relative grid h-16 grid-cols-[auto_1fr_auto] items-center justify-between gap-2 px-2"
  >
    <div class="h-full px-2">
      <a href="/gallery" class="flex h-full w-28">
        <Logo />
      </a>
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

    <div class="flex gap-2">
      <Button
        icon={UploadIcon}
        label="Add Media"
        onclick={() => (addModalActive = true)}
      />

      <div class="relative">
        <IconButton
          icon={MenuIcon}
          label="Open Main Menu"
          onclick={(e) => {
            if (!mainMenuActive) mainMenuActive = true;
          }}
        />
        <ExpandBox bind:active={mainMenuActive} class="top-14 right-0">
          <ContextMenu
            items={[
              {
                icon: GalleryIcon,
                label: "Gallery",
                active: page.url.pathname === "/gallery",
                href: "/gallery",
              },
              {
                icon: SettingsIcon,
                label: "Settings",
                active: page.url.pathname === "/settings",
                href: "/settings",
              },
            ]}
            onclose={() => (mainMenuActive = false)}
          />
        </ExpandBox>
      </div>
    </div>
  </header>

  <div class="h-full overflow-auto">
    {@render children()}
  </div>
</div>
