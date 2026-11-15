import { defineConfig } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  root: '.',
  base: './',
  plugins: [{
    name: 'admin-route',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin.html';
          next();
        });
      };
    },
  }, {
    name: 'copy-classic-scripts',
    apply: 'build',
    generateBundle() {
      for (const file of readdirSync(resolve('js')).filter(file => file.endsWith('.js'))) {
        this.emitFile({
          type: 'asset',
          fileName: `js/${file}`,
          source: readFileSync(resolve('js', file)),
        });
      }
    },
  }],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: [
        'index.html',
        'catalog.html',
        'about.html',
        'contact.html',
        'admin.html',
        'ethnic-wear.html',
        'western-wear.html',
        'nightwear.html',
        'cosmetics-jewelry.html',
      ],
    },
  },
});
