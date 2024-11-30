// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintConfigPrettier from 'eslint-config-prettier'
import fs from 'node:fs'

const prettierConf = JSON.parse(fs.readFileSync('./.prettierrc', 'utf-8'))

export default withNuxt({
  rules: {
    'prettier/prettier': [
      'error',
      {
        ...prettierConf,
      },
    ],
    'no-var': 'error',
    'no-console': 'warn',
    'linebreak-style': ['error', 'unix'],
    'eol-last': ['error', 'always'],
    'prefer-const': 'error',
    'node/no-unsupported-features/es-syntax': 'off',
    'no-unused-vars': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
})
  .prepend(eslintPluginPrettierRecommended)
  .prepend(eslintConfigPrettier)
