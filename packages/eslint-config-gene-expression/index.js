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
    'browser': true
  },

  rules: {
    'no-var': 'error', // Enforce using const and let, rather than var
    semi: ['error', 'never'], // Disallow semicolons
    quotes: ['error', 'backtick'], // Enforce using `` for strings
    eqeqeq: ['error', 'always'] // Enforce using === and !==
  }
}