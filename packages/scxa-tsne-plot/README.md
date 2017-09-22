# Template for Gene Expression Atlas and Single Cell Expression Atlas NPM packages

## Instructions

***Be sure to be running [npm@4.0.0 or greater to use appropriately the script `prepublishOnly` in
`package.json`](https://github.com/npm/npm/issues/10074). You might want to use Node.js 7 or greater.***

### Clone this repository
```
git clone https://github.com/gxa/atlas-package my-package
cd my-package
rm -rf .git
git init
git remote add origin https://github.com/gxa/my-package.git
```
Remember to create the new repository. The recommendation is to prefix the package name with “atlas-”.

### Fill in package metadata
Fill in the fields `name`, `description` and `repository`. As a general rule the packages are prefixed with
“expression-atlas-” or “sc-atlas-”. Finally, replace or remove `README.md`.

## Scripts

### `build`
Creates a pre-compiled (i.e. Babel transpiled) version of the code from `src` to `lib`. The main entry of the package
is `lib/index.js`. The `lib` directory mimics the structure of `src` so all your exports should be in  `src/index.js`.
All other files (images, stylesheets, etc.) should be placed inside `src` following whatever directory structure you
prefer (e.g. `src/assets`, `src/img`). You may use [Less](http://lesscss.org/) or [Sass](http://sass-lang.com/) but
remember to compile them to regular CSS and `import` the latter. In short: files with the extension `js` will be
transpiled, all others will be copied through, `less` and `sass` files will be skipped.

### `prepublishOnly`
Runs the `build` script before `npm publish`. Only the `lib` directory is packaged, so make sure everything (including
assests such as CSS or images are there).

## Testing
Basic test boilerplate is included with [Jest](https://facebook.github.io/jest/) and
[Enzyme](http://airbnb.io/enzyme/). Jest is a test runner, an assertion library and a snapshot tester, whereas Enzyme
allows DOM testing. See the examples included in `__test__` to get an idea.

### Continuous integration
If you want CI and nice passing/failing badges, enable the repository in Travis CI. Add the file
`.travis.yml` with the following:
```
language: node_js
node_js:
  - "8"
```

Now, with each push, Travis CI will run your tests and generate a report. You can display a test status badge going to
Travis CI, clicking on the badge and pasting the Markdown embed snippet on your `README.md`.

Enabling code coverage is very similar. You need to install the `coveralls` package:
```
npm install --save-dev coveralls
```

Or:
```
yarn add --dev coveralls
```

Add the `posttest` script to `package.json`:
```
"posttest": "cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js"
```

Now, every time that Jest is run, it will generate coverage information and send it to Coveralls for a coverage report.
If you go to Coveralls, you can also get a snippet to embed the coverage report shield on your readme file.


## What’s included?
- [React 15.6 and PropTypes](https://facebook.github.io/react/)
- [URI.js](https://medialize.github.io/URI.js/) for URL manipulation
- [Babel](https://babeljs.io/) with presets `env`, `react` and the [object spread operator plugin](https://babeljs.io/docs/plugins/transform-object-rest-spread/) (see `.babelrc`)
- [Webpack and Webpack dev server](https://webpack.js.org/)
- [Jest](https://facebook.github.io/jest/) and [Enzyme](http://airbnb.io/enzyme/) for testing

## Polyfills
No polyfills are included by default, but you might want one or both of these two:
- [Fetch polyfill](https://github.com/github/fetch)
- [Babel polyfill](https://babeljs.io/docs/usage/polyfill/)

### NPM
```
npm install --save-dev whatwg-fetch babel-polyfill
```
### Yarn
```
yarn add --dev whatwg-fetch babel-polyfill
```
Tweak your `webpack.config.js` to include them in your entry points:
```
entry: {
  myComponent: ['babel-polyfill', 'whatwg-fetch', './html/render.js']
  ...
}
```
