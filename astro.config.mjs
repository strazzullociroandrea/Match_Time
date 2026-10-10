// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    mode: 'directory',
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), AstroPWA(
  {
    "registerType": 'autoUpdate',
    "name": "Match Time",
    "short_name": "",
    "icons": [
      {
        "src": "/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
  })]
});

