import { isTauri } from "@tauri-apps/api/core";

export const ENVIRONMENT = isTauri() ? "desktop" : null;
