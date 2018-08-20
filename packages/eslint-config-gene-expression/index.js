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
    'jest': true
  },

  // TODO This doesn't seem to do anything... This should solve issues like requiring static image files (see this https://github.com/airbnb/javascript/issues/1332)
  settings: {
    'import/resolver': 'webpack'
  },

  rules: {
    'no-var': 'error', // Enforce using const and let, rather than var
    semi: ['error', 'never'], // Disallow semicolons
    quotes: ['error', 'backtick'], // Enforce using `` for strings
    eqeqeq: ['error', 'always'] // Enforce using === and !==
  }
}