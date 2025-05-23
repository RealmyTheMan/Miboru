import { vite as vidstack } from "vidstack/plugins";
import Icons from "unplugin-icons/vite";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    Icons({ compiler: "svelte" }),
    vidstack(),
  ],
});
