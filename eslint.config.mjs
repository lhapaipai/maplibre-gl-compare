import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ["src", "example", "test"],
  languageOptions: {
    ecmaVersion: 2022,

    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
