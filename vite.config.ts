import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/admin/programs': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.method === 'GET') {
              const url = req.url;
              if (!url) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'URL is required' }));
                return;
              }
              const filePath = url.split('/').pop();
              if (filePath) {
                const fullPath = path.join(__dirname, 'public', 'programs', filePath);
                try {
                  const data = fs.readFileSync(fullPath, 'utf8');
                  res.end(data);
                } catch (error) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Program file not found' }));
                }
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'File name is required' }));
              }
            } else if (req.method === 'POST') {
              const url = req.url;
              if (!url) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'URL is required' }));
                return;
              }
              const filePath = url.split('/').pop();
              if (filePath) {
                const fullPath = path.join(__dirname, 'public', 'programs', filePath);
                let body = '';
                req.on('data', chunk => {
                  body += chunk.toString();
                });
                req.on('end', () => {
                  try {
                    fs.writeFileSync(fullPath, body);
                    res.statusCode = 200;
                    res.end(JSON.stringify({ message: 'Programs saved successfully' }));
                  } catch (error) {
                    console.error('Error saving file:', error);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Failed to save program file' }));
                  }
                });
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'File name is required' }));
              }
            }
          });
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            '@/components/ui/button',
            '@/components/ui/table',
            '@/components/ui/dropdown-menu',
            '@/components/ui/card',
            '@/components/ui/badge',
            '@/components/ui/tooltip',
            '@/components/ui/dialog',
          ],
          'program-components': [
            '@/components/ProgramCard',
            '@/components/ProgramModal',
            '@/components/TableView',
            '@/components/program-modal/ProgramDetails',
            '@/components/program-modal/ProgramHeader',
            '@/components/program-modal/ProgramFooter'
          ],
          'admin-components': [
            '@/components/admin/ProgramTable',
            '@/components/admin/ProgramForm',
            '@/components/admin/FileSelector',
            '@/components/admin/ActionBar',
          ],
          'data-utils': [
            '@/data/programs/index',
            '@/types/program',
            '@/utils/emojiUtils',
          ],
          'search-filter': [
            '@/components/SearchBar',
            '@/components/FilterPanel',
          ],
        },
      },
    },
  },
}));
