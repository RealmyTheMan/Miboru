<script lang="ts">
  import clsx from "clsx";
  import type { Component } from "svelte";

  interface Props {
    icon: Component;
    label: string;
    active: boolean;
    href: string;
  }

  let { icon: Icon, label, active, href }: Props = $props();
</script>

<a {href} tabindex="-1">
  <button
    class={clsx(
      "flex h-12 w-full cursor-pointer items-center border-l-3 px-3 transition-all hover:opacity-85 active:opacity-65",
      {
        "border-accent-red": active,
        "text-alt border-l-transparent": !active,
      },
    )}
  >
    <div class="text-xl">
      <Icon />
    </div>
    <span
      class={clsx("ml-2", { "font-semibold": active, "font-medium": !active })}
      >{label}</span
    >
  </button>
</a>
