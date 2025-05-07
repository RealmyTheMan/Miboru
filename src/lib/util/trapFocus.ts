import { onMount } from "svelte";

export function trapFocus(node: HTMLElement) {
  let focusableEls: HTMLElement[] = [];
  let firstEl: HTMLElement | null = null;
  let lastEl: HTMLElement | null = null;

  const FOCUSABLE =
    "a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), " +
    "textarea:not([disabled]), button:not([disabled]), iframe, object, embed, " +
    '[contenteditable], [tabindex]:not([tabindex="-1"])';

  function updateList() {
    focusableEls = Array.from(
      node.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter(
      (el) =>
        !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
    );
    firstEl = focusableEls[0] || null;
    lastEl = focusableEls[focusableEls.length - 1] || null;
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    updateList();
    const focused = document.activeElement as HTMLElement;

    if (e.shiftKey) {
      if (focused === firstEl || focused === node) {
        e.preventDefault();
        lastEl?.focus();
      }
    } else {
      if (focused === lastEl) {
        e.preventDefault();
        firstEl?.focus();
      }
    }
  }

  onMount(() => {
    node.addEventListener("keydown", handleKey);

    return () => {
      node.removeEventListener("keydown", handleKey);
    };
  });
}
