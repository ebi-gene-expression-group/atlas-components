# Atlas Components

A collection of React components used in the front end of [Expression Atlas](https://www.ebi.ac.uk/gxa) and
[Single Cell Expression Atlas](https://www.ebi.ac.uk/gxa/sc).

This is a [Lerna](https://github.com/lerna/lerna)-managed monorepo. Read Lerna’s documentation for more details.

## local setup

```bash
npm install
npx lerna bootstrap
```

In short, remember to run `npx lerna bootstrap` from the top level directory after you install or remove packages in
each `package.json` to ensure the dependencies have been correctly symlinked. We have noticed that sometimes NPM, as
usual, has some unexpected behaviour.

## working on several components

If you are working on several components, and would like to test your changes locally, you need
to pack you dependencies and install them manually.

For example, assuming B is a dependency of A:

```bash
cd packages/B
npm pack
cd ../A
npm install ../B/B*.tgz
npm test
```
