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

By default, if there’s an error fetching the remote data, instead of the wrapped component an
[alert Callout](https://foundation.zurb.com/sites/docs/callout.html) will be rendered with a brief description of the
underlying error. If you want to handle the error yourself you can pass an arbitrary object in the prop
`errorPayloadInsteadOfCallout`, which will be then added to the pass-through props instead of the data retrieved from
the failing endpoint. This is especially useful if e.g. you’d like to render an error message within your wrapped
component.
