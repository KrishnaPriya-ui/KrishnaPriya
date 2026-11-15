import { defineConfig } from 'vite';

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
