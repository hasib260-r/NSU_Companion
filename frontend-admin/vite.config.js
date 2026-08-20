import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/admin/",
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    hmr: {
      clientPort: 3000,
    },
  },
  preview: {
    port: 5174,
    strictPort: true,
  },
});
