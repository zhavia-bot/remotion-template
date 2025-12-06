import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      input: "./index.html",
    },
  },
});
