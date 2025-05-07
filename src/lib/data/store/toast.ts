import { writable } from "svelte/store";

interface Toast {
  type: "error";
  message: string;
  duration: number | null;
  _id?: number;
}

const toasts: Toast[] = [];
export const toastsStore = writable(toasts);

export async function runToast(params: Toast) {
  if (!params._id) params._id = Math.random();
  toasts.push(params);
  toastsStore.set(toasts);

  if (params.duration)
    setTimeout(() => removeToast(params._id || 0), params.duration);
}

export async function removeToast(id: number) {
  toasts.splice(
    toasts.findIndex((i) => i._id === id),
    1,
  );
  toastsStore.set(toasts);
}
