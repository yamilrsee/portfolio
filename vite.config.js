import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // Primary HTML file
        page1: 'thank-you.html', // Additional HTML file
        // page2: 'pag2', // I can keep adding pagges
      },
    },
  },
});