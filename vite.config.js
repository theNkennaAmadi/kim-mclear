import { defineConfig } from 'vite'

export default defineConfig({
    main: './index.js', // The path should be relative to the project root
    build: {
        minify: true,
        manifest: true,
        rollupOptions: {
            input: './index.js',
            output: {
                format: 'umd',
                entryFileNames: 'index.js',
                esModule: false,
                compact: true,
            },
        },
    },
})