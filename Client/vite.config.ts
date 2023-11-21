import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: '../API/wwwroot',
    },
    server: {
        port: 3000,
        https: true,
    },
    plugins: [react(), basicSsl()],
});
