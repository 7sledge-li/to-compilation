import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/package/index.ts"),
      name: "7SledgeLi",
      fileName: "7sledge-li",
    },
    rollupOptions: {
      external: "vue",
      output: {
        globals: {
          vue: "vue",
        },
      },
    },
  },
});
