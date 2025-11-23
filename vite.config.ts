import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import istanbul from "vite-plugin-istanbul";

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
    istanbul({
      include: "src/*",
      exclude: ["node_modules"],
      extension: [".js", ".ts", ".vue"],
      /**
       * This allows us to omit the INSTRUMENT_BUILD env variable when running the production build via
       * npm run build.
       * More details below.
       */
      requireEnv: false,
      /**
       * If forceBuildInstrument is set to true, this will add coverage instrumentation to the
       * built dist files and allow the reporter to collect coverage from the (built files).
       * However, when forceBuildInstrument is set to true, it will not collect coverage from
       * running against the dev server: e.g. npm run dev.
       *
       * To allow collecting coverage from running cypress against the dev server as well as the
       * preview server (built files), we use an env variable, INSTRUMENT_BUILD, to set
       * forceBuildInstrument to true when running against the preview server via the
       * instrument-build npm script.
       *
       * When you run `npm run build`, the INSTRUMENT_BUILD env variable is omitted from the npm
       * script which will result in forceBuildInstrument being set to false, ensuring your
       * dist/built files for production do not include coverage instrumentation code.
       */
      forceBuildInstrument: Boolean(process.env.INSTRUMENT_BUILD),
    }),
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
