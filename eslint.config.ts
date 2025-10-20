import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginVue from "eslint-plugin-vue";
import eslintPluginCypress from "eslint-plugin-cypress";
import eslintPluginChaiFriendly from "eslint-plugin-chai-friendly";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  { ignores: ["*.d.ts", "**/coverage", "**/dist"] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,vue}"],
    ignores: ["cypress/**/*"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "vue/attribute-hyphenation": [
        "error",
        "always",
        {
          ignoreTags: ["ix:nonFraction", "ix:nonNumeric", "ix:tuple"],
        },
      ],
    },
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      eslintPluginCypress.configs.recommended,
      eslintPluginChaiFriendly.configs.recommendedFlat,
    ],
    files: ["cypress/**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "cypress/no-unnecessary-waiting": "off",
    },
  },
  eslintConfigPrettier,
);
