<script lang="ts">
  import Modal from "$lib/components/adaptable/Modal.svelte";
  import type { MediaItem } from "$lib/types/Media";
  import ImageDemo from "$lib/components/adaptable/ImageDemo.svelte";
  import clsx from "clsx";
  import TagEditor from "$lib/components/adaptable/TagEditor.svelte";
  import { addToSyncQueue } from "$lib/data/store/sync";
  import { editMedia, type MediaEditResponse } from "$lib/src/api/edit";
  import FloatBox from "$lib/components/adaptable/FloatBox.svelte";
  import ContextMenu from "$lib/components/adaptable/ContextMenu.svelte";
  import { deleteMedia } from "$lib/src/api/delete";
  import MoreIcon from "~icons/material-symbols/more-vert";
  import DeleteIcon from "~icons/material-symbols/delete-rounded";
  import ConfirmationModal from "$lib/components/adaptable/ConfirmationModal.svelte";

  interface Props {
    mediaItem: MediaItem | null;
    active: boolean;
    onedit?: (id: string, params: MediaEditResponse) => void;
    ondelete?: (id: string) => void;
  }

  let {
    mediaItem,
    active = $bindable(),
    onedit = () => null,
    ondelete = () => null,
  }: Props = $props();

  let maximizeActive = $state(false);
  let deleteConfirmationActive = $state(false);
  let mediaItemMenuCoords: [number, number] | null = $state(null);

  $effect(() => {
    if (active === false) maximizeActive = false;
  });

  let timeout: number | null = null;

  function editTitle(title: string) {
    if (!mediaItem) return;
    addToSyncQueue(
      (async () => {
        const response = await editMedia({
          id: mediaItem.id,
          fields: { title },
        });
        onedit(mediaItem.id, response);
      })(),
      "Editing title",
    );
  }

  async function onSubmitDeleteItem() {
    if (!mediaItem) return; // never
    await deleteMedia({ id: mediaItem.id });
    ondelete(mediaItem.id);
    active = false;
  }
</script>

{#if mediaItem && active}
  <button
    class={clsx(
      "bg-panel fixed top-0 left-0 z-200 h-full w-full cursor-zoom-out transition-all duration-300",
      {
        "pointer-events-auto opacity-100": maximizeActive,
        "pointer-events-none scale-90 opacity-0": !maximizeActive,
      },
    )}
    aria-label="Close maximized image"
    onclick={() => (maximizeActive = false)}
  >
    <ImageDemo src={mediaItem.src} alt={mediaItem.title || "Untitled image"} />
  </button>
{/if}

<!-- Media item actions menu -->
<FloatBox bind:coordinates={mediaItemMenuCoords}>
  <ContextMenu
    items={[
      {
        icon: DeleteIcon,
        label: "Delete Item",
        onclick: () => (deleteConfirmationActive = true),
      },
    ]}
    bind:coordinates={mediaItemMenuCoords}
  />
</FloatBox>

<!-- Delete confirmation modal -->
<ConfirmationModal
  title="Delete Media Item"
  onsubmit={onSubmitDeleteItem}
  bind:active={deleteConfirmationActive}
/>

<!-- The modal -->
<Modal
  bind:active
  onescape={() => {
    if (maximizeActive) maximizeActive = false;
    else active = false;
  }}
>
  {#if mediaItem}
    <div class="">
      <button
        class="h-[60vh] w-full cursor-zoom-in"
        aria-label="Maximize image"
        onclick={() => (maximizeActive = true)}
      >
        {#if mediaItem.type.startsWith("image/")}
          <ImageDemo
            src={mediaItem.src}
            alt={mediaItem.title || "Untitled image"}
          />
        {/if}
      </button>

      <div class="p-5">
        <div class="grid grid-cols-[1fr_auto] items-center gap-2">
          <input
            class="border-main w-full rounded-md text-2xl font-semibold transition-all outline-none focus:border focus:p-1 focus:px-2"
            value={mediaItem.title}
            placeholder="Add a title..."
            oninput={(e) => {
              if (timeout) clearTimeout(timeout);
              timeout = setTimeout(
                () => editTitle((e.target as HTMLInputElement).value),
                300,
              );
            }}
            onkeydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (timeout) clearTimeout(timeout);
                editTitle((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).blur();
              }
            }}
          />

          <button
            class="gs-icon-button"
            aria-label="Open Media Item Menu"
            onclick={(e) => (mediaItemMenuCoords = [e.clientX, e.clientY])}
          >
            <MoreIcon />
          </button>
        </div>

        <div class="text-dimmed mt-2 flex flex-wrap gap-5">
          <p><b>ID</b>: <span class="select-text">{mediaItem.id}</span></p>
          <p>
            <b>MIME type</b>: <span class="select-text">{mediaItem.type}</span>
          </p>
        </div>
      </div>

      <div class="border-t-main border-t p-5">
        <TagEditor
          initialValue={mediaItem.tags}
          onedit={(addedTag, removedTag, tags) =>
            addToSyncQueue(
              (async () => {
                const response = await editMedia({
                  id: mediaItem.id,
                  fields: { tags },
                });
                onedit(mediaItem.id, response);
              })(),
              "Editing tags",
            )}
        />
      </div>
    </div>
  {/if}
</Modal>
