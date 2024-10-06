import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from 'tailwindcss'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from "path";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl(), TanStackRouterVite(),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
      ],
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
