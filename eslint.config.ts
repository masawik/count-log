import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
// @ts-expect-error - no types available for this plugin
import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: [ '.react-router/**/*' ],
  },
  js.configs.recommended,
  {
    files: [ '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}' ],
    languageOptions: { globals: globals.browser },
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    rules: {
      'no-empty-pattern': [ 'warn', { allowObjectPatternsAsParameters: true } ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
      'jsx-quotes': [ 'error', 'prefer-double' ],
      'react-hooks/exhaustive-deps': [
        'warn',
      ],
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    files: [ '**/*.ts', '**/*.tsx', '**/*.mjs', '**/*.js' ],
    rules: {
      'no-console': [ 'warn', { allow: [ 'warn', 'error' ] } ],
      '@stylistic/brace-style': [ 'warn', '1tbs', { allowSingleLine: true } ],
      'no-empty': [ 'error' ],
      'eol-last': [ 'error', 'always' ],
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
          enums: 'always-multiline',
          generics: 'ignore',
          tuples: 'ignore',
        },
      ],
      '@stylistic/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],

      // Увеличено до двух, для коротких функций, вроде `const commitLazyValue = () => { model.value = lazyValue.value }`
      '@stylistic/max-statements-per-line': [ 'warn', { max: 2 } ],
      // В zod настройки (например, invalid_type_error) указываются через snake_case
      camelcase: [ 'off' ],
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],

      '@stylistic/max-len': [
        'warn',
        {
          code: 140,
          tabWidth: 2,
          comments: 300,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreRegExpLiterals: true,
        },
      ],
      '@stylistic/semi': [ 'warn', 'never' ],
      '@stylistic/array-bracket-spacing': [ 'warn', 'always' ],
      '@stylistic/object-curly-spacing': [ 'warn', 'always' ],
      '@stylistic/quote-props': [ 'error', 'as-needed' ],
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
        },
      ],
      curly: [ 'warn', 'multi-line' ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // A11y rules - некоторые правила ослаблены для удобства разработки
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },
  {
    files: [ '**/*.{js,cjs,mjs,ts,tsx}' ],

    plugins: {
      import: importPlugin,
    },

    settings: {
      'import/resolver': {
        // чтобы понимал tsconfig paths и расширения TS/TSX
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            [ 'parent', 'sibling', 'index' ],
            'object',
            'type',
          ],

          // FSD слои (под алиас "@/...")
          pathGroups: [
            { pattern: '@/app/**', group: 'internal', position: 'before' },
            { pattern: '@/pages/**', group: 'internal', position: 'before' },
            { pattern: '@/widgets/**', group: 'internal', position: 'before' },
            { pattern: '@/features/**', group: 'internal', position: 'before' },
            { pattern: '@/entities/**', group: 'internal', position: 'before' },
            { pattern: '@/shared/**', group: 'internal', position: 'before' },
          ],

          pathGroupsExcludedImportTypes: [ 'builtin', 'external' ],
          'newlines-between': 'always',

          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
])
