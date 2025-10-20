declare module "eslint-plugin-chai-friendly" {
  import type { Linter } from "eslint";

  const chaiFriendlyPlugin: {
    configs: {
      recommendedFlat: Linter.Config;
    };
  };

  export default chaiFriendlyPlugin;
}
