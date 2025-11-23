/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  return {
    base: "/iidx-rlt/",
    server: {
      host: true,
    },
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
      visualizer() as PluginOption,
      VitePWA({
        registerType: "prompt",
        manifest: {
          name: "RLT Manager",
          short_name: "RLT Manager",
          description: "beatmania IIDXのランダムレーンチケット活用支援ツール",
          start_url: "/iidx-rlt/",
          scope: "/iidx-rlt/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#1976d2",
          icons: [
            {
              src: "icons/icon192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icons/icon512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
          navigateFallbackDenylist: [/^\/iidx-rlt\/sitemap\.xml$/, /^\/iidx-rlt\/robots\.txt$/],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/iidx-rlt/data/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "data-cache",
                networkTimeoutSeconds: 5,
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
              },
            },
          ],
        },
      }),
    ],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      coverage: {
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/{pages,test}", "src/types.ts", "src/storage/index.ts"],
      },
    },
    ssr: {
      noExternal: ["react-helmet-async"],
    },
    build: {
      outDir: "dist",
      ssrManifest: true,
    },
  };
});
