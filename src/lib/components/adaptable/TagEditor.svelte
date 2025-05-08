<script lang="ts">
  import { onMount } from "svelte";
  import BackspaceIcon from "~icons/material-symbols/backspace-rounded";

  interface Props {
    initialValue?: string[] | null;
    placeholder?: string | null;
    autofocus?: boolean;
    limit?: number;
    onedit?: (
      addedTag: string | null,
      removedTag: string | null,
      tags: string[],
    ) => void;
    onenter?: (tags: string[]) => void;
  }

  let {
    initialValue = null,
    placeholder = "Enter tags...",
    autofocus = false,
    limit = 50,
    onedit = () => null,
    onenter = () => null,
  }: Props = $props();

  let inputElement: HTMLInputElement | null = $state(null);
  let value = $state(placeholder);
  let inputContentWidth: number = $state(0);

  let tags: string[] = $state(
    initialValue?.map((i) => i.trim().toLowerCase()) || [],
  );

  onMount(() => {
    setTimeout(() => {
      if (autofocus) inputElement?.focus();
    });
  });

  function updateInput(newCharacter?: string) {
    if (!inputElement) return; // never
    if (newCharacter) inputElement.value += newCharacter;
    value = inputElement.value || placeholder;
  }

  function onAddTagSignal() {
    if (!inputElement) return; // never

    const tagName = inputElement.value.trim().toLowerCase();
    if (tagName.length !== 0 && !tags.includes(tagName)) {
      tags.push(tagName);
      onedit(tagName, null, tags);
    }

    inputElement.value = "";
    updateInput();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!inputElement) return; // never

    if (e.key === ",") {
      e.preventDefault();
      onAddTagSignal();
    } else if (e.key === "Enter") {
      onAddTagSignal();
      onenter(tags);
    } else if (e.key === "Backspace" && inputElement.value === "") {
      const removedItem = tags.pop();
      if (removedItem) onedit(null, removedItem, tags);
    }

    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(e.key)) {
      e.preventDefault();
      updateInput(e.key.toLowerCase());
    } else if (
      e.key === " " &&
      (inputElement.value.trim() === "" || inputElement.value.endsWith(" "))
    ) {
      e.preventDefault();
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="relative flex cursor-text flex-wrap items-center gap-[0.5em] overflow-hidden"
  onclick={() => inputElement?.focus()}
>
  {#each tags as tag, idx}
    <button
      class="bg-button flex h-[2em] cursor-pointer items-center justify-center rounded-full px-[0.75em] transition-all hover:opacity-85 active:opacity-65"
      onclick={() => {
        const [removedTag] = tags.splice(idx, 1);
        onedit(null, removedTag, tags);
      }}
    >
      <span class="text-[0.9em] font-semibold">{tag}</span>
    </button>
  {/each}

  <!-- Invisible input width tracker -->
  <p
    class="pointer-events-none invisible absolute top-2 left-0 text-[1em]"
    bind:clientWidth={inputContentWidth}
  >
    {value}
  </p>

  {#if tags.length < limit}
    <input
      type="text"
      class="h-[2em] max-w-full text-[1em] outline-none"
      {placeholder}
      style="width:calc({inputContentWidth}px + 1.5rem)"
      aria-label="Input for entering tags"
      maxlength="56"
      oninput={() => updateInput()}
      onkeydown={onKeyDown}
      bind:this={inputElement}
    />
  {:else}
    <button
      class="bg-button flex h-[2em] cursor-pointer items-center justify-center rounded-full px-[0.75em] transition-all hover:opacity-85 active:opacity-65"
      onclick={() => {
        tags.splice(tags.length - 1, 1);
        setTimeout(() => inputElement?.focus(), 1);
      }}
      aria-label="Remove last tag"
    >
      <span class="text-[0.9em] font-semibold"><BackspaceIcon /></span>
    </button>

    <p class="text-accent-red m-1 text-sm">
      Limit reached ({limit})
    </p>
  {/if}
</div>
