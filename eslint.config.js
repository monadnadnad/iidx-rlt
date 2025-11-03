import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import vitest from "@vitest/eslint-plugin";

const typeAwareLanguageOptions = {
  parser: tseslint.parser,
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
};

const typeAwareRules = {
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],
  "func-style": ["error", "expression", { allowArrowFunctions: true }],
};

const sourceFiles = ["src/**/*.ts", "src/**/*.tsx", "scripts/**/*.ts"];
const vitestTestFiles = ["src/**/*.test.ts", "src/**/*.test.tsx", "scripts/**/*.test.ts"];

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    files: sourceFiles,
    languageOptions: typeAwareLanguageOptions,
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...typeAwareRules,
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: vitestTestFiles,
    languageOptions: {
      ...typeAwareLanguageOptions,
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/unbound-method": "off",
      "vitest/prefer-strict-equal": "warn",
      "vitest/padding-around-expect-groups": "warn",
      "vitest/padding-around-all": "warn",
      "vitest/padding-around-test-blocks": "warn",
    },
  },
];
