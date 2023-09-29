//import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url';

// configure vite to publish the svelte components as a library
// https://vitejs.dev/guide/build.html#library-mode
// https://vitejs.dev/config/#library


/*
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
})*/

let __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: UserConfig = {
	plugins: [svelte()],
	//optimizeDeps: { include: ["@carbon/charts", "svelte-pdf"], exclude: ['@carbon/telemetry'] },
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'TSvelvet',
            // the proper extensions will be added
            fileName: 'tsvelvet',
        }
    }
};

export default config;

