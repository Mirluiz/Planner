import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 2222,
    hmr: false, // Disable Hot Module Replacement
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["three-bvh-csg"],
  },
});
