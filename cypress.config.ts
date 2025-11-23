/* eslint-disable @typescript-eslint/no-require-imports */

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        removeDirectory: require("cypress-delete-downloads-folder")
          .removeDirectory,
      });

      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    scrollBehavior: "center",
    video: true,
  },
});
