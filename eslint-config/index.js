module.exports = {
  env: {
    browser: true,
    es2021: true
  },

  plugins: [
    'react',
    'cypress'
  ],

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:cypress/recommended',
    'standard'
  ],

  settings: {
    react: {
      version: 'detect'
    }
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  rules: {
    'no-var': 'error', // Enforce using const and let, rather than var
    semi: ['warn', 'never'], // Disallow semicolons
    quotes: ['warn', 'backtick'], // Enforce using `` for strings
    eqeqeq: ['error', 'always'], // Enforce using === and !==
    indent: ['error', 2], // Enforce indentation using 2 spaces
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and console.error statements
    'multiline-ternary': ['error', 'always-multiline'],
    'operator-linebreak': ['error', 'after'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }]
  },

  overrides: [{
    files: ['*.test.js'],
    plugins: ['jest'],
    extends: ['plugin:jest/recommended']
  }]
}
