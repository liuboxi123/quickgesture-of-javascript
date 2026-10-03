import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, "src/index.js"),
            name: "QuickGesture",
            formats: ["es", "umd"],
            fileName: (format) => {
                if(format === 'es') return "index.esm.js";
                return "index.js";
            }
        },
        sourcemap: false,
        minify: "esbuild"
    }
});