<script lang="ts">
  import Modal from "$lib/components/adaptable/Modal.svelte";
  import type { MediaItem } from "$lib/types/Media";
  import TagEditor from "$lib/components/adaptable/TagEditor.svelte";
  import { addToSyncQueue } from "$lib/data/store/sync";
  import { editMedia, type MediaEditResponse } from "$lib/src/api/edit";
  import FloatBox from "$lib/components/adaptable/FloatBox.svelte";
  import ContextMenu from "$lib/components/adaptable/ContextMenu.svelte";
  import { deleteMedia } from "$lib/src/api/delete";
  import ConfirmationModal from "$lib/components/adaptable/ConfirmationModal.svelte";
  import MediaPreview from "$lib/components/functional/media/MediaPreview.svelte";
  import MoreIcon from "~icons/material-symbols/more-vert";
  import DeleteIcon from "~icons/material-symbols/delete-rounded";
  import SaveFileIcon from "~icons/material-symbols/sim-card-download-rounded";
  import { saveMediaItem } from "$lib/src/local/util/saveMediaItem";

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

  let deleteConfirmationActive = $state(false);
  let mediaItemMenuCoords: [number, number] | null = $state(null);

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

<!-- Media item actions menu -->
<FloatBox bind:coordinates={mediaItemMenuCoords}>
  <ContextMenu
    items={[
      {
        icon: DeleteIcon,
        label: "Delete Item",
        onclick: () => (deleteConfirmationActive = true),
      },
      {
        icon: SaveFileIcon,
        label: "Save Copy",
        onclick: () => {
          if (mediaItem) saveMediaItem(mediaItem);
        },
      },
    ]}
    onclose={() => (mediaItemMenuCoords = null)}
  />
</FloatBox>

<!-- Delete confirmation modal -->
<ConfirmationModal
  title="Delete Media Item"
  onsubmit={onSubmitDeleteItem}
  bind:active={deleteConfirmationActive}
/>

<!-- The modal -->
<Modal bind:active>
  {#if mediaItem}
    <div class="">
      <div class="h-[60vh]">
        <MediaPreview item={mediaItem} />
      </div>

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

        <div class="text-dimmed mt-2 flex flex-wrap gap-2">
          <p><b>ID</b>: <span class="select-text">{mediaItem.id}</span></p>
          <p>
            <b>MIME type</b>: <span class="select-text">{mediaItem.type}</span>
          </p>
          <p>
            <b>Size</b>: <span class="select-text">{mediaItem.size}</span>
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
