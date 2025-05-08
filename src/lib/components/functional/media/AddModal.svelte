<script lang="ts">
  import UploadIcon from "~icons/material-symbols/upload-file-outline-rounded";
  import Modal from "$lib/components/adaptable/Modal.svelte";
  import { addMedia } from "$lib/src/api/add";
  import { goto } from "$app/navigation";
  import clsx from "clsx";
  import Spinner from "$lib/components/adaptable/Spinner.svelte";

  interface Props {
    active: boolean;
  }

  let { active = $bindable() }: Props = $props();

  let isDraggingOver = $state(false);
  let loading = $state(false);

  async function onClickUploader() {
    const input = document.createElement("input");
    input.type = "file";

    input.onchange = () => {
      if (!input.files || !input.files[0]) return input.remove();
      const file = input.files[0];
      input.remove();

      handleFileUpload(file);
    };

    input.click();
  }

  function onDropFile(
    e: DragEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files || !files[0]) return;
    handleFileUpload(files[0]);
  }

  async function handleFileUpload(file: File) {
    loading = true;
    const { id } = await addMedia({ file, automaticTitle: file.name });

    goto(`/gallery?tags=${JSON.stringify([`id:${id}`])}&autoOpen=1`);

    loading = false;
    active = false;
  }
</script>

<Modal bind:active>
  <div class="h-96">
    <div class="flex h-full w-full items-center justify-center p-2">
      {#if loading}
        <div class="text-2xl"><Spinner /></div>
      {:else}
        <button
          class={clsx(
            "hover:bg-button flex w-3/4 cursor-pointer flex-col items-center justify-center rounded-lg p-8 text-center transition-all active:opacity-85",
            {
              "bg-button": isDraggingOver,
            },
          )}
          ondragenter={(e) => {
            isDraggingOver = true;
          }}
          ondragover={(e) => e.preventDefault()}
          ondragleave={() => {
            isDraggingOver = false;
          }}
          ondrop={(e) => {
            isDraggingOver = false;
            onDropFile(e);
          }}
          onclick={onClickUploader}
        >
          <div class="text-accent-red text-6xl"><UploadIcon /></div>

          <h2 class="mt-4 text-2xl">Drag and Drop or Click to Add</h2>
          <p class="text-alt mt-2 text-sm">
            Any media you add will be <i>copied</i> into a different location, which
            will therefore use your storage.
          </p>
        </button>
      {/if}
    </div>
  </div>
</Modal>
