import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      workbox: { clientsClaim: true, skipWaiting: true }
    })
  ],
  build: {
    chunkSizeWarningLimit: 2000
  },
  server: {
    host: "0.0.0.0",
    port: 5173
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, "src/app")
    }
  }
});
