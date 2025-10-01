import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
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
