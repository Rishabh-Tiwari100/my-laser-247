import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import path from 'path';
import fs from 'fs';

const seoPages = [
  {
    route: '/',
    title: 'Laser247 India | Cricket ID & Live Casino Games Bonus',
    description:
      'Laser247 is India’s best site for instant cricket ID, sports exchange & live casino. Register now for easy deposits, withdrawals & 24/7 support.',
  },
  {
    route: '/sports/cricket',
    title: 'India’s Trusted Cricket Betting Site for Best Live Odds',
    description:
      'Get instant Cricket Betting ID on Laser247 India for best live IPL odds, World Cup & other event coverage plus self deposits, withdrawals & 24/7 support.',
  },
  {
    route: '/sports/football',
    title: 'Best Online Football Betting Exchange | Laser247 India',
    description:
      'Live Football Betting gets more exciting with Laser247 India Sports Exchange, FIFA & Other Top League coverage with instant ID creation, pay in and out.',
  },
  {
    route: '/sports/tennis',
    title: 'Best Live Tennis Betting Odds with Laser247 India',
    description:
      'Best Tennis Betting with Laser247 India’s sportsbook, instant ID creation, Wimbledon, US Open, other top events, easy deposits, withdrawals & 24/7 support.',
  },
  {
    route: '/casino',
    title: 'Most Loved Live Casino Games with Laser247 India',
    description:
      'Play Casino Games online with Laser247 India’s live dealer tables, slots, card games & more with the best odds, quick deposits & secure withdrawals.',
  },
  {
    route: '/casino/evolution',
    title: 'Evolution Casino Games Live with Laser247 India',
    description:
      'Play Evolution Casino Games Live with Laser247 India’s casino betting ID, live card games, roulette and blackjack with easy self pay in and out.',
  },
];

function productionSeoFiles() {
  return {
    name: 'production-seo-files',

    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');

      if (!fs.existsSync(indexPath)) {
        console.error('index.html not found in dist');
        return;
      }

      const baseHtml = fs.readFileSync(indexPath, 'utf8');

      /*
       * Generate route-specific HTML
       */
      seoPages.forEach(({ route, title, description }) => {
        let html = baseHtml;

        // Remove existing title
        html = html.replace(/<title>[\s\S]*?<\/title>/i, '');

        // Remove existing description
        html = html.replace(
          /<meta\s+name=["']description["'][^>]*>/i,
          ''
        );

        // Add production SEO metadata
        const seoTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="https://laserindia.net${route === '/' ? '' : route}" />`;

        html = html.replace('</head>', `${seoTags}\n  </head>`);

        /*
         * Homepage uses dist/index.html
         * Other routes get their own index.html
         */
        if (route === '/') {
          fs.writeFileSync(indexPath, html, 'utf8');
          return;
        }

        const routeDir = path.join(
          distDir,
          route.replace(/^\/|\/$/g, '')
        );

        fs.mkdirSync(routeDir, { recursive: true });

        fs.writeFileSync(
          path.join(routeDir, 'index.html'),
          html,
          'utf8'
        );
      });

      /*
       * Generate sitemap.xml
       */
      const sitemapUrls = seoPages
        .map(
          ({ route }) => `  <url>
    <loc>https://laserindia.net${route === '/' ? '' : route}</loc>
  </url>`
        )
        .join('\n');

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${sitemapUrls}

</urlset>
`;

      fs.writeFileSync(
        path.join(distDir, 'sitemap.xml'),
        sitemap,
        'utf8'
      );

      /*
       * Generate robots.txt
       */
      const robots = `User-agent: *
Allow: /

Sitemap: https://laserindia.net/sitemap.xml
`;

      fs.writeFileSync(
        path.join(distDir, 'robots.txt'),
        robots,
        'utf8'
      );

      console.log(
        '✓ Generated production SEO metadata, sitemap.xml and robots.txt'
      );
    },
  };
}

export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), '');

  const seoEnabled =
    env.VITE_SEO_ENABLED === 'true';
  return {
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
    ...(seoEnabled ? [productionSeoFiles()] : []),
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
          rtkQuery: [
            '@reduxjs/toolkit/query',
            '@reduxjs/toolkit/query/react',
          ],
          ui: [
            '@radix-ui/react-popover',
            '@radix-ui/react-dialog',
            '@radix-ui/react-scroll-area',
          ],
        },
      },
    },
  },

  server: {
    host: true,
    port: 3000,
    open: false,
    // proxy: {
    //   '/api': {
    //     // target: 'https://api-notout.insoftdemo.site',
    //     target: 'https://api.notout.co',
    //     // target: 'https://staging-api.notout.co',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
}});