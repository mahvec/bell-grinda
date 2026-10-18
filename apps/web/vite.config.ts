import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const path = id.replaceAll("\\", "/");
          if (["/node_modules/react/", "/node_modules/react-dom/", "/node_modules/react-router/", "/node_modules/react-router-dom/"].some((part) => path.includes(part))) return "react-vendor";
          if (["/node_modules/@reduxjs/", "/node_modules/react-redux/", "/node_modules/redux/", "/node_modules/immer/", "/node_modules/reselect/"].some((part) => path.includes(part))) return "state-vendor";
          if (["/node_modules/dexie/", "/node_modules/zod/"].some((part) => path.includes(part))) return "data-vendor";
          if (path.includes("/node_modules/@phosphor-icons/")) return "icons-vendor";
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["icon.svg", "icon-180.png", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "BellGrinda",
        short_name: "BellGrinda",
        description: "Local-first kettlebell and bodyweight training",
        theme_color: "#601700",
        background_color: "#F7F9F9",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
        ]
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,woff2,webp,png}"],
        runtimeCaching: [
          {
            urlPattern: /\/media\/[a-z0-9-]+\.mp4$/,
            handler: "CacheFirst",
            options: {
              cacheName: "exercise-media-v1",
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 90 },
              rangeRequests: true
            }
          }
        ]
      }
    })
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  }
});
