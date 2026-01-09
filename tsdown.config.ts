import { defineConfig } from "tsdown";

const config = defineConfig([
  {
    entry: "src/maplibre-gl-compare.ts",
    platform: "browser",
    format: {
      esm: {
        minify: false,
      },

      umd: {
        minify: true,
      },
    },
    outputOptions: {
      name: "Compare",
      globals: {
        "maplibre-gl": "maplibregl",
      },
    },
    outDir: "dist",
    noExternal: ["@mapbox/mapbox-gl-sync-move"],
  },
]);

export default config;
