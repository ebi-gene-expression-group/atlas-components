# scxa-cell-type-wheel

Run tests with:
```bash
npx cypress run --component
```

If you want to omit video recording:
```bash
npx cypress run --component --record false
```

Find coverage reports at:
`./coverage/lcov-report/index.html`

## Add code coverage (in a nutshell)

This is an abridged version of https://docs.cypress.io/guides/tooling/code-coverage.

Add the following three packages:
```bash
npm install -D babel-plugin-transform-class-properties babel-plugin-istanbul @cypress/code-coverage
```

Add the two plugins to your `.babelrc` file:
```json
{
  "presets": ["@babel/preset-react", "@babel/preset-env"],
  "plugins": [ "transform-class-properties", "istanbul" ]
}
```

Add `@cypress/code-coverage` in your `cypress.config.js` file so it looks like this:
```js
const { defineConfig } = require(`cypress`)

module.exports = defineConfig({
  component: {
    setupNodeEvents(on, config) {
      require(`@cypress/code-coverage/task`)(on, config)
      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config
    },
    devServer: {
      framework: `react`,
      bundler: `webpack`
    }
  }
})
```

Lastly, add the following import to `cypress/support/component.js`:
```js
import '@cypress/code-coverage/support'
```