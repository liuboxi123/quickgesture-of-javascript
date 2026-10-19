import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        lib: {
            entry: resolve("src/index.js"),
            name: "QuickGesture",
            formats: ["es", "umd"],
            fileName: (format) => format === "es" ? "index.esm.js" : "index.umd.cjs",
        },
        sourcemap: false,
        minify: false
    }
});