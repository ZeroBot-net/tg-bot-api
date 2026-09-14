'use strict';

/**
 * ESLint flat configuration (ESLint >= 9).
 *
 * Kept self-contained and dependency-free so `npm run lint` works with a clean
 * install — no shared-config peer conflicts and no ESM/CJS interop surprises.
 */

const NODE_GLOBALS = {
  require: 'readonly',
  module: 'readonly',
  exports: 'readonly',
  process: 'readonly',
  console: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  global: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  setImmediate: 'readonly',
  clearImmediate: 'readonly',
  queueMicrotask: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  TextEncoder: 'readonly',
  TextDecoder: 'readonly',
};

const MOCHA_GLOBALS = {
  describe: 'readonly',
  it: 'readonly',
  before: 'readonly',
  after: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  context: 'readonly',
  specify: 'readonly',
};

const COMMON_RULES = {
  'no-undef': 'error',
  'no-dupe-keys': 'error',
  'no-dupe-args': 'error',
  'no-unreachable': 'error',
  'no-unsafe-negation': 'error',
  'no-constant-condition': 'warn',
  'no-empty': ['warn', { allowEmptyCatch: true }],
  'no-unused-vars': ['warn', {
    args: 'after-used',
    ignoreRestSiblings: true,
    argsIgnorePattern: '^_',
  }],
};

module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**', 'doc/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: NODE_GLOBALS,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    rules: COMMON_RULES,
  },
  {
    files: ['test/**/*.js', 'examples/**/*.js'],
    languageOptions: {
      globals: { ...NODE_GLOBALS, ...MOCHA_GLOBALS },
    },
  },
  {
    // Browser scripts for the static docs site.
    files: ['docs/**/*.js'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        CSS: 'readonly',
        matchMedia: 'readonly',
      },
    },
  },
];
