import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { importX, createNodeResolver } from 'eslint-plugin-import-x';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  {
    files: ['**/*.ts'],
    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import-x/resolver-next': [
        createNodeResolver({
          extensions: ['.ts', '.js', '.mjs'],
        }),
      ],
    },
    rules: {
      'no-debugger': 'off',
      'no-console': 'off',
      'no-var': 'error',
      'class-methods-use-this': 'off',
      '@typescript-eslint/no-explicit-any': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
  eslintPluginPrettier,
]);
