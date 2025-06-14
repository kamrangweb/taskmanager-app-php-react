// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";

export default defineConfig([
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    ignores: ["node_modules", "dist", "build"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: globals.browser,
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint,
      react,
    },
    rules: {
      // Örnek: kendi kurallarını burada belirleyebilirsin
      "@typescript-eslint/no-unused-vars": "warn",
      "no-constant-condition": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
