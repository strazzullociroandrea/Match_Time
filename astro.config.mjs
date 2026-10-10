// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';
 
export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    mode: 'directory',
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
       devOptions: {
        enabled: true,
        navigateFallback: '/',
      },
      manifest: {
        name: "Match Time",
        short_name: "MatchTime",
        description: "Elenco delle partite di pallavolo del comitato PGS Milano",
        start_url: "/",
        id: "/",
        scope: "/",
        lang: "it",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ]
});