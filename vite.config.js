import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import * as path from 'node:path';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    visualizer(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      includeAssets: ['favicon.ico', 'robots.txt'],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Mikhak',
        short_name: 'Mikhak',
        description: 'Integrated management system for business microservices',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'assets/icons/icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'assets/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        treeshake: true,
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          chakra: ['@chakra-ui/react'],
          editorjs: [
            '@ckeditor/ckeditor5-react',
            'ckeditor5',
          ],
          leaflet: ['leaflet', 'react-leaflet'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    conditions: ['mui-modern', 'module', 'browser', 'development|production'],
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    https: true,
    strictPort: true,
    port: 3000,
    proxy: {
      '/auth/prox/apis/': {
        // target: 'http://192.168.17.23:8000',
        // target: 'http://172.24.24.1:8000',
        target: 'http://192.168.13.72:32333/',
        secure: false,
        changeOrigin: true,
        rewrite(path) {
          return path.replace(/\/auth\/prox\/apis\//i, '/');
        },
      },
      '/mikhak/': {
        // target: 'http://192.168.13.49:9000/mikhak',
        // target: 'http://172.24.24.1:8000/mikhak',
        target: 'http://192.168.13.72:32333/mikhak/api/',
        secure: false,
        changeOrigin: true,
        rewrite(path) {
          return path.replace(/\/mikhak\//i, '/');
        },
      },
    },
  },
});
