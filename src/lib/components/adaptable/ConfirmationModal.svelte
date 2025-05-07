<script lang="ts">
  import Button from "./Button.svelte";
  import Modal from "./Modal.svelte";
  import CheckIcon from "~icons/material-symbols/check-rounded";
  import CloseIcon from "~icons/material-symbols/close-rounded";

  interface Props {
    active: boolean;
    title: string;
    onsubmit: () => Promise<any>;
  }

  let { active = $bindable(), title, onsubmit }: Props = $props();

  let loading = $state(false);
</script>

<Modal layer={10} showClose={false} bind:active>
  <div class="p-4">
    <p class="mb-1 text-2xl font-semibold">
      {title}
    </p>
    <p class="text-alt">Are you sure you want to do this?</p>

    <div class="mt-4 flex items-center gap-2">
      <Button
        icon={CheckIcon}
        label="Continue"
        {loading}
        onclick={async () => {
          loading = true;
          await onsubmit();
          loading = false;
          active = false;
        }}
      />
      <Button
        icon={CloseIcon}
        label="Cancel"
        onclick={() => (active = false)}
      />
    </div>
  </div>
</Modal>
