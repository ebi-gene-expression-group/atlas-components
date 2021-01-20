# Integration component of organ-anatomogram and experiment table

## Instructions

***Because the organ-anatomogram is not published yet, we create a local npm package to install.***

### Clone organ-anatomogram repository
```
git clone https://github.com/ebi-gene-expression-group/organ-anatomogram.git
cd organ-anatomogram
git checkout origin/feature/164401762-add-kidney-svgs
npm install
npm pack
pwd
```

Suppose that we get the absolute path for this repository is `/AAA/BBB/CCC`, as the output of `pwd`.

### Clone atlas-components repository and install
```
git clone https://github.com/ebi-gene-expression-group/atlas-components.git
cd atlas-components
npm install
npm install eslint-plugin-react --no-save --no-save-dev   # See section about linting below
npx lerna bootstrap
npm install --save /AAA/BBB/CCC
```

## Run it on your browser
Use Webpack-Dev-Server:
```
npx webpack-dev-server -d
```
