module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    plugins: ["react", "react-hooks", "@typescript-eslint"],
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    rules: {
      // Kendi kurallarını burada tanımlayabilirsin
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "react/react-in-jsx-scope": "off"
    }
  };
  