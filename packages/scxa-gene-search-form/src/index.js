import React from 'react'
import ReactDOM from 'react-dom'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

import GeneSearchForm from './GeneSearchForm'

const GeneSearchFormWithFetchLoader = withFetchLoader(GeneSearchForm)
const render = (options, target) => {
  ReactDOM.render(
    <GeneSearchFormWithFetchLoader
      {...options}
      loadingPayloadProvider={() =>
        ({ speciesSelectStatusMessage: `Fetching species…` })}
      errorPayloadProvider={(error) =>
        ({ speciesSelectStatusMessage: `${error.name}: ${error.message}` })}
    />,
    document.getElementById(target))
}

export { GeneSearchForm as default, render }
