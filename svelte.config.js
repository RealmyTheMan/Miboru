import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tauriConfig from "./src-tauri/tauri.conf.json" with { type: "json" };

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({ fallback: "index.html" }),
    version: {
      name: tauriConfig.version,
    },
  },
};

export default config;
