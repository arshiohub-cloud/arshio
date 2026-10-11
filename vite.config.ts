import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@tanstack/react-start/server": path.resolve(__dirname, "./src/lib/mock-start.ts"),
      "@tanstack/react-start": path.resolve(__dirname, "./src/lib/mock-start.ts"),
    },
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
