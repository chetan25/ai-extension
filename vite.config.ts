import { defineConfig } from "vite";
// import { fileURLToPath } from "url";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "./src/components/popup/popup.html"),
        "service-worker": resolve(__dirname, "./src/worker/service-worker.js"),
        content: resolve(__dirname, "./src/content.ts"),
        // popup: fileURLToPath(new URL("./public/popup.html", import.meta.url)),
      },
    },
  },
});
