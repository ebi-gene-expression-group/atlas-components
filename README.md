# Atlas Components

A collection of React components used in the front end of [Expression Atlas](https://www.ebi.ac.uk/gxa) and
[Single Cell Expression Atlas](https://www.ebi.ac.uk/gxa/sc).

This is a [Lerna](https://github.com/lerna/lerna)-managed monorepo. Read Lerna’s documentation for more details.

In short, remember to run `npx lerna bootstrap` from the top level directory after you install or remove packages in
each `package.json` to ensure the dependencies have been correctly symlinked. We have noticed that sometimes NPM, as
usual, has some unexpected behaviour.

## About linting

Even though NPM no longer installs `peerDependencies`, we follow
[ESLint’s recommendation on shareable configs](https://eslint.org/docs/developer-guide/shareable-configs#publishing-a-shareable-config).
For this reason, you should install `eslint-plugin-react` in each individual package like this:
```bash
npm install eslint-plugin-react --no-save --no-save-dev
```

And if you’re using Atom, because it won’t bother to use your package’s settings (you know, it’s better to reinvent
the wheel every single time), this might be useful:
```bash
cd ~/.atom/packages/linter-eslint
npm install @ebi-gene-expression-group/eslint-config eslint-plugin-react

```
