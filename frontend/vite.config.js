import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    hmr: {
      host: "localhost",
      protocol: "ws",
      port: 24678,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});