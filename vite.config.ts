import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),

    compression({
      algorithms: ['gzip', 'brotliCompress'],
      threshold: 10240,
      exclude: [/\.br$/, /\.gz$/],
    }),

    // visualizer({
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    //   filename: 'stats.html',
    // }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/layouts': path.resolve(__dirname, './src/layouts'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/theme': path.resolve(__dirname, './src/theme'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/tests': path.resolve(__dirname, './src/tests'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',

    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          rtkQuery: ['@reduxjs/toolkit/query', '@reduxjs/toolkit/query/react'],
          ui: ['@radix-ui/react-popover', '@radix-ui/react-dialog', '@radix-ui/react-scroll-area'],
        },
      },
    },
  },

  server: {
    host: true,
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'https://api.laserindia.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
