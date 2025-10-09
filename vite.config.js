import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // Primary HTML file
        privacy: 'privacy-policy.html',
        // page1: 'thank-you.html', // Additional HTML file - removed since file doesn't exist
        // page2: 'pag2', // I can keep adding pagges
      },
    },
  },
});
