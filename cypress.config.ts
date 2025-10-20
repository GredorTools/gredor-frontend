import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        removeDirectory: require("cypress-delete-downloads-folder")
          .removeDirectory,
      });
    },
    scrollBehavior: "center",
    video: true,
  },
});
