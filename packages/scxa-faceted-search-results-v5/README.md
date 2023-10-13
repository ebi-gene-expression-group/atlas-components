# Faceted Search Results for Single Cell Expression Atlas

[![Build Status](https://travis-ci.org/ebi-gene-expression-group/scxa-faceted-search-results.svg?branch=master)](https://travis-ci.org/ebi-gene-expression-group/scxa-faceted-search-results) [![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/scxa-faceted-search-results/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/scxa-faceted-search-results?branch=master)

A lightweight and extensible component to list and filter lists of search results. It receives a URL (as a combination
of `host` and `resource`) to async-fetch the results, and a React component class to visualise each element (e.g. a
card).

The facets are used to render a sidebar on the left as a set of filtering controls. 
Filter groups can be displayed either as searchable, multiselect dropdown lists or as checkboxes.

Two more optional props, namely `noResultsMessageFormatter` and `resultsMessageFormatter`, return a string which is
displayed when there are no results, and as a header on top of the search results, respectively. In many occasions it
is useful to display such messages using information returned by the server; that’s the reason why both functions take
the JSON payload as an argument, allowing for some customisation in that regard. For example, if in the case of no
results the server returns a field `reason` you could have something like this:
```
<ReactFacetedSearch
  ...
  noResultsMessageFormatter={(data) => `Your search yielded no results: ${data.reason}`}
```

# Requirements

You should have at least Node 16 LTS with NPM 8 or later.
You can check your current installed version executing this command.
```shell
npm --version
8.5.6
```

## How to execute the unit tests with Cypress

We are using the [Cypress framework](https://docs.cypress.io/guides/overview/why-cypress) for unit testing this package.
You can execute the existing tests in the following way:
1. Type `npx cypress open` in the terminal in the root folder of this package.
2. In the appearing browser window you have to click on `Component Testing`,
   select a browser and click on `Start Component Testing in <browser name>`.
3. In the appearing list just click on the test you would like to run and check the results on the screen.

## Try out the component with a given example
Just run [webpack-dev-server](https://github.com/webpack/webpack-dev-server):
```
npx webpack serve --mode=development
```

## How to run test with code coverage in the console

Run tests with:

```shell
npx cypress run --component
```

If you want to omit video recording:

```shell
npx cypress run --component --record false
```

Find coverage reports at: `./coverage/lcov-report/index.html`


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

# Combining with the EBI Visual Framework
React-Select allows you to style the `div` that encloses the `input` element, but not the `input` element itself.
Therefore it’s convenient to add the snippet below to override the styling set by the
[EBI Visual Framework](https://github.com/ebiwd/EBI-Framework) for `input` elements.
```
.input-clear input, .input-clear input:focus {
  height: unset;
  box-shadow: none;
  margin: 0;
}
```
At the time of writing this applies to the most recent version (v1.3). Wrapping these styles within the appropriate
`div` selector is sufficient. See
https://github.com/ebi-gene-expression-group/scxa-faceted-search-results/blob/master/html/filter-list.html for a
working example.

# A note about building with Webpack
The component uses `async`/`await` to fetch the JSON payload from the server. This requires to prefix the entry with
`@babel/polyfill`. If you are already using an equivalent polyfill or
[Runtime transform](http://babeljs.io/docs/plugins/transform-runtime/) you may skip this.
