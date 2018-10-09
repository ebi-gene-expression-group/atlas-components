module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },

  env: {
    'browser': true,
    'jest': true,
    'es6': true
  },

  settings: {
    'import/resolver': 'webpack'
  },

  rules: {
    'no-var': 'error', // Enforce using const and let, rather than var
    semi: ['warning', 'never'], // Disallow semicolons
    quotes: ['warning', 'backtick'], // Enforce using `` for strings
    eqeqeq: ['error', 'always'], // Enforce using === and !==
    indent: ['error', 2], // Enforce indentation using 2 spaces
    'no-console': ['warning', { allow: ['warn', 'error']}] // Allow console.warn and console.error statements
  }
}