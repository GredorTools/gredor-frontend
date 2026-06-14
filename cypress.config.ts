import { defineConfig } from "cypress";

// @ts-expect-error - cypress-delete-downloads-folder är inte korrekt typat
import { removeDirectory } from "cypress-delete-downloads-folder";

import codeCoverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        removeDirectory,
      });

      codeCoverageTask(on, config);
      return config;
    },
    scrollBehavior: "center",
    video: true,
  },
});
