//import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath,URL } from 'url';
import postcss from './postcss.config.js';
import buildCesium from 'vite-plugin-cesium-build';

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
    define: {
        global: 'window',
    },
    plugins: [
        svelte(),
        buildCesium(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    //optimizeDeps: { include: ["@carbon/charts", "svelte-pdf"], exclude: ['@carbon/telemetry'] },
    /*build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'WManag',
            // the proper extensions will be added
            fileName: 'wmanag',
        }
    },*/
    css: {
        postcss
    },
    server: {
        cors: {
            "origin": "*",
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 204
        },
        port: 5175,
    },
};

export default config;

