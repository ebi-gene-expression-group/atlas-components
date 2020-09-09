# Expression Atlas React Fetch Loader
[![Build Status](https://travis-ci.com/ebi-gene-expression-group/atlas-react-fetch-loader.svg?branch=master)](https://travis-ci.com/ebi-gene-expression-group/atlas-react-fetch-loader) [![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/atlas-react-fetch-loader/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/atlas-react-fetch-loader?branch=master)

A React HOC component that enables other components to remotely `fetch` data from an endpoint.

## Usage
```js
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import MyComponent from 'my-component'

const MyComponentWithFetchLoader = withFetchLoader(MyComponent)

ReactDOM.render(
  <MyComponentWithFetchLoader
    host={`https://domain.tld/path/`}
    resource={`json/endpoint`}
    errorPayloadProvider={ error => /* some object with error info for the wrapped component */ }
    loadingPayloadProvider={ data => /* some object to display feedback while the component is loading */ }
    fulfilledPayloadProvider={ data => /* some object that is added as props */ }
    {...passThroughProps} />,
  target)
```

Be aware that fields in the JSON data can overwrite values passed in as props if they have the same keys.

### Error signalling
By default, if there’s an error fetching the remote data, instead of the wrapped component an
[alert Callout](https://foundation.zurb.com/sites/docs/callout.html) will be rendered with a description of the
underlying error in order to conform to the [EBI Visual Framework](https://github.com/ebiwd/EBI-Framework). If you
want to handle the error yourself you can pass an `errorPayloadProvider` function prop; it takes an error object as its
only argument and returns an arbitrary object which will be destructured and added to the pass-through props. This is
especially useful if e.g. you’d like to render an error message within your wrapped component using info such as the
error code or a message supplied by the server.

The props expected by the callout component should have the following shape:
```ts
interface Error {
  description: string;
  name: string;
  message: string;
}
```

The above is a subset of
[JavaScript Error objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error).

### Loading
There is a similar prop, `loadingPayloadProvider`, to replace the animated loading message with the wrapped component
and give feedback based on the return value of the function, which should be an object to be destructured and added
to the pass-through props. In this case, however, the function has no arguments since data hasn’t been retrieved yet.
If you wish to make a complex transformation based on a prop value, you can always pass a closure over whatever
arguments you need.

### Adding props
Besides the new props coming from the `fetch` request, you can add a `fulfilledPayloadProvider` function which takes
the payload as an argument and returns an object which, again, is destructured and added as props to the wrapped
component. Additionally, you can rename fields from the JSON object with the `renameDataKeys` prop: any key is renamed
to the string value.
