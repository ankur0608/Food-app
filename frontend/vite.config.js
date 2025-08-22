import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning to 2 MB (optional)
    chunkSizeWarningLimit: 2000, // KB
  },
});
