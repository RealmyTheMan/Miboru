<script lang="ts">
  import { goto } from "$app/navigation";
  import Modal from "$lib/components/adaptable/Modal.svelte";
  import TagEditor from "$lib/components/adaptable/TagEditor.svelte";
  import { deriveTags } from "$lib/data/state/tags.svelte";

  interface Props {
    active: boolean;
  }

  let { active = $bindable() }: Props = $props();

  let keywords = $derived.by(deriveTags);

  function modalOpen() {}
</script>

<Modal float="top" onopen={modalOpen} bind:active>
  <div class="h-full">
    <div class="p-4 px-5 text-lg">
      <TagEditor
        initialValue={keywords}
        placeholder="Enter a tag or filter..."
        autofocus={true}
        onenter={(tags) => {
          goto(`/gallery?tags=${JSON.stringify(tags)}`);
          active = false;
        }}
      />
    </div>
  </div>
</Modal>
