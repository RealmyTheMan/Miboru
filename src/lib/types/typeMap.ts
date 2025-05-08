import type { Component } from "svelte";
import VideoIcon from "~icons/material-symbols/videocam-rounded";

interface TypeMapItem {
  icon: Component;
  color: "red" | "pink" | "purple";
}

export const typeMap: Record<string, TypeMapItem> = {
  video: { icon: VideoIcon, color: "red" },
};
