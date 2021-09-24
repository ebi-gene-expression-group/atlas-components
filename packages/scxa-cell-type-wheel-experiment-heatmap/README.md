# Template for Gene Expression Atlas and Single Cell Expression Atlas NPM packages

## Instructions

***Be sure to be running npm@4.0.0 or later. At least Node.js 10 LTS is strongly recommended.***

### Clone this repository
```bash
git clone https://github.com/ebi-gene-expression-group/atlas-package my-package
cd my-package
rm -rf .git
git init
git remote add origin https://github.com/ebi-gene-expression-group/my-package.git
```
Remember to create then a new repository in the specified origin above. Prefix the package name with “atlas-” if this
package is to be used by both (bulk) Expression Atlas and Single Cell Expression Atlas (i.e. a general package);
otherwise use “gxa-” or “scxa-”. If you think your project is general enough to be used as a utility package by others,
feel free drop the prefix. You can have a look at
[our packages repo](https://github.com/ebi-gene-expression-group/atlas-components/tree/master/packages) to see some
examples.

### Fill in package metadata
Fill in the fields `name`, `description` and `repository`. Finally, replace or remove `README.md`.

## Scripts

### `prepare`
Runs the `build` script before `npm publish`. Only the `lib` directory is packaged, so make sure everything (including
assets such as CSS or images are there).

### `_postversion`, `_postpublish`
If your package is managed by an external manager such as Lerna you won’t need these two scripts. If your package is
going to be manually versioned and published, remove the leading underscore to automate version bumping and publishing:
after bumping the version with e.g. `npm version minor`, the package is automatically published and pushed, with all
tags.

### `test`
`npm test` runs all phases of the test lifecycle (i.e. `pretest`, `test` and `posttest`); in case you’ve added support
for Coveralls you won’t likely want to run the `posttest` phase. If that’s the case just do `npx jest`.

## Testing
Basic test boilerplate is included with [Jest](https://facebook.github.io/jest/) and
[Enzyme](http://airbnb.io/enzyme/). Jest is a test runner, an assertion library and a snapshot tester, whereas Enzyme
allows DOM testing. See the examples included in `__test__` to get an idea.

### Continuous integration
If you want CI and nice passing/failing badges, enable the repository in [Travis CI](https://travis-ci.org/). Now, with
each push, Travis CI will run your tests and generate a report. You can display a test status badge going to Travis CI,
clicking on the badge and pasting the Markdown embed snippet on your `README.md`.

Enabling code coverage is very similar. You need to enable your repository in [Coveralls](https://coveralls.io/).
Every time that Travis is run, it will generate coverage information and send it to Coveralls for a coverage report.
If you go to Coveralls, you can also get a snippet to embed the coverage report shield on your readme file.

## What’s included?
- [React 16 and PropTypes](https://facebook.github.io/react/)
- [URI.js](https://medialize.github.io/URI.js/) for URL manipulation (the rich version of `query-string`)
- [Babel](https://babeljs.io/) with presets `env` and `react` (see `.babelrc`)
- [Webpack 4 with Webpack-CLI and Webpack-Dev-Server](https://webpack.js.org/)
- [Jest](https://facebook.github.io/jest/) and [Enzyme](http://airbnb.io/enzyme/) for testing

## Polyfills
No polyfills are included by default, but you might want one or both of these:
- [Fetch polyfill](https://github.com/github/fetch)
- [Babel polyfill](https://babeljs.io/docs/usage/polyfill/)

### NPM
```bash
npm install --save-dev whatwg-fetch @babel/polyfill
```

Tweak your `webpack.config.js` to include them in your entry points:
```javascript
entry: {
  myComponent: [`@babel/polyfill`, `whatwg-fetch`, `./html/render.js`]
  ...
}
```

## Run it on your browser
Use Webpack-Dev-Server:
```bash
npx webpack-dev-server -d
```
