import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { tanstackStart } from "@tanstack/react-start/plugin/rsbuild";
import { VanillaExtractPlugin } from "@vanilla-extract/webpack-plugin";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    tanstackStart({
      srcDirectory: "src-ts",
      router: {
        routesDirectory: "routes",
        generatedRouteTree: "routeTree.gen.ts",
      },
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          autoSubfolderIndex: true,
          outputPath: "/tauri-shell",
          crawlLinks: true,
          retryCount: 3,
        },
      },
    }),
    pluginReact({
      reactRefreshOptions: {
        exclude: [/\.css\.ts$/],
      },
    }),
    pluginSvgr(),
  ],
  server: {
    port: 3000,
    strictPort: true,
    host: "localhost",
  },
  splitChunks: {
    cacheGroups: {
      vanilla: {
        test: /@vanilla-extract\/webpack-plugin/,
        // make sure that chunks containing modules created by @vanilla-extract/webpack-plugin have stable IDs
        // in development mode to avoid HMR issues
        name: process.env.NODE_ENV === "development" && "vanilla",
        chunks: "all",
      },
    },
  },
  tools: {
    rspack: {
      plugins: [new VanillaExtractPlugin()],
      watchOptions: {
        ignored: ["**/.git", "**/node_modules", "**/src-tauri"],
      },
    },
  },
});
