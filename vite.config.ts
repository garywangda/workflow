import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: { main: path.resolve(__dirname, 'index.html'), formDesigner: path.resolve(__dirname, 'form-designer.html') } } },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
