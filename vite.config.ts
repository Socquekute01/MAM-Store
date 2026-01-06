import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://khoancatbetongtienxuan.com/',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://khoancatbetongtienxuan.com/',
        changeOrigin: true,
      },
    },
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app'),
    },
  },
});
