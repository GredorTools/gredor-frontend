import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

const appVersion = JSON.stringify(
  process.env.npm_package_version +
    "-" +
    execSync("git rev-parse --short HEAD").toString().trim(),
);

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: appVersion,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // XHTML för taxonomier
          isCustomElement: (tag) =>
            tag.startsWith("ix:") ||
            tag.startsWith("link:") ||
            tag.startsWith("xbrli:") ||
            tag.startsWith("xlink:"),
          // För att special-markup <!-- @delete-whitespace --> ska fungera
          comments: true,
        },
      },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      $fonts: resolve("./public/fonts"),
    },
  },
  // Tysta ner deprecationvarningar från Bootstrap.
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "mixed-decls",
          "color-functions",
          "global-builtin",
        ],
      },
    },
  },
});
