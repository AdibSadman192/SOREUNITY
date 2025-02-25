import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['**/node_modules/**', '.next/**', 'dist/**', '*.config.js', '*.config.mjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: '.',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'semi': ['error', 'always'],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error'
    }
  }
];