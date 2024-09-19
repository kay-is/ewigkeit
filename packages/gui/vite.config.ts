import { defineConfig } from "vitest/config"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { svelteTesting } from "@testing-library/svelte/vite"

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",
  base: "./",
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
  },
  build: {
    outDir: "../build",
    rollupOptions: {
      output: {
        manualChunks: {
          ao: ["@permaweb/aoconnect"],
          gui: [
            "flowbite",
            "flowbite-svelte",
            "flowbite-svelte-blocks",
            "flowbite-svelte-icons",
            "flowbite-typography",
          ],
        },
      },
      input: {
        home: "./src/index.html",
        new: "./src/new.html",
        deployments: "./src/deployments.html",
        domains: "./src/domains.html",
        members: "./src/members.html",
      },
    },
  },
})
