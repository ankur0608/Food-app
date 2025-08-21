import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning to 2 MB (optional)
    chunkSizeWarningLimit: 2000, // KB

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui")) return "mui";
            if (id.includes("react")) return "react-vendor";
            if (id.includes("@tanstack/react-query")) return "react-query";
            return "vendor";
          }
        },
      },
    },
  },
});
