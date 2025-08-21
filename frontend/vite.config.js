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
            // Split React & React DOM
            if (id.includes("react") || id.includes("react-dom"))
              return "react-vendor";

            // Split Material-UI into separate chunk
            if (id.includes("@mui")) return "mui";

            // Split react-icons
            if (id.includes("react-icons")) return "react-icons";

            // All other node_modules into vendor
            return "vendor";
          }
        },
      },
    },
  },
});
