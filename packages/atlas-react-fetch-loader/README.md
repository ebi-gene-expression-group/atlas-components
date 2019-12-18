# Expression Atlas React Fetch Loader
[![Build Status](https://travis-ci.com/ebi-gene-expression-group/atlas-react-fetch-loader.svg?branch=master)](https://travis-ci.com/ebi-gene-expression-group/atlas-react-fetch-loader) [![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/atlas-react-fetch-loader/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/atlas-react-fetch-loader?branch=master)

A HOC React component that enables other components to remotely fetch data from an endpoint.

## Usage
```js
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import MyComponent from 'my-component'

const FetchLoadMyComponent = withFetchLoader(MyComponent)

<FetchLoadMyComponent
  host={`https://domain.tld/path/`}
  resource={`json/endpoint`}
  {...passThroughProps} />
```

Be aware that fields in the JSON data overwrite values passed in as props.

By default, if there’s an error fetching the remote data, instead of the wrapped component an
[alert Callout](https://foundation.zurb.com/sites/docs/callout.html) will be rendered with a brief description of the
underlying error (this is to conform to the [EBI Visual Framework](https://github.com/ebiwd/EBI-Framework)). If you
want to handle the error yourself you can pass an `errorPayloadProvider` function prop; it takes an error object as its
only argument and returns an arbitrary object which will be destructured and added to the pass-through props. This is
especially useful if e.g. you’d like to render an error message within your wrapped component using info such as the
error code or a message supplied by the server.

The error object has the following shape:
```ts
interface Error {
  description: string;
  name: string;
  message: string;
}
```

There is a similar prop, `loadingPayloadProvider`, to replace the animated loading message with your own component. In
this case, however, the function has no arguments. As a matter of fact it could be an object, but as a function it’s
consistent with `errorPayloadProvider`.
