# Expression Atlas React Fetch Loader
[![Build Status](https://travis-ci.com/ebi-gene-expression-group/atlas-react-fetch-loader.svg?branch=master)](https://travis-ci.com/ebi-gene-expression-group/atlas-react-fetch-loader) [![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/atlas-react-fetch-loader/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/atlas-react-fetch-loader?branch=master)

A HOC React component that enables other components to remotely fetch data from an endpoint.

## Usage
```js
import withFetchLoader from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import MyComponent from 'my-component'

const MyComponentFoo = withFetchLoader(MyComponent)

<MyComponentFoo
  host={`https://domain.tld/path/`}
  resource={`json/endpoint`}
  {...passThroughProps} />
```

Be aware that fields in the JSON data overwrite values passed in as props.

