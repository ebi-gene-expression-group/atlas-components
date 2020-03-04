# Atlas Components

A collection of React components used in the front end of [Expression Atlas](https://www.ebi.ac.uk/gxa) and
[Single Cell Expression Atlas](https://www.ebi.ac.uk/gxa/sc).

This is a [Lerna](https://github.com/lerna/lerna)-managed monorepo. Read Lerna’s documentation for more details.

```bash
npm install
npm install eslint-plugin-react --no-save --no-save-dev   # See section about linting below
npx lerna bootstrap
```

In short, remember to run `npx lerna bootstrap` from the top level directory after you install or remove packages in
each `package.json` to ensure the dependencies have been correctly symlinked. We have noticed that sometimes NPM, as
usual, has some unexpected behaviour.

## Linting

Even though NPM no longer installs `peerDependencies`, we follow
[ESLint’s recommendation on shareable configs](https://eslint.org/docs/developer-guide/shareable-configs#publishing-a-shareable-config).
You can install `eslint-plugin-react` in the root package like detailed in the instructions above.

And if you’re using Atom, because it won’t bother to use your package’s settings (you know, it’s better to reinvent
the wheel every single time), this might be useful:
```bash
cd ~/.atom/packages/linter-eslint
npm install @ebi-gene-expression-group/eslint-config eslint-plugin-react

```
