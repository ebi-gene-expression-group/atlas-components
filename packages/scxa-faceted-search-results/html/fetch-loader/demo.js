import React from 'react'
import ReactDOM from 'react-dom'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import FacetedSearchContainer from '../../src/index'

import ExperimentCard from './ExperimentCard'
import ExperimentsHeader from './ExperimentsHeader'

const FacetedSearchContainerWithFetchLoader = withFetchLoader(FacetedSearchContainer)

const render = (options, target) => {
  ReactDOM.render(
    <FacetedSearchContainerWithFetchLoader
      {...options}
      sortTitle={`markerGenes`}
      ResultElementClass={ExperimentCard}
      ResultsHeaderClass={ExperimentsHeader}
    />,
    document.getElementById(target))
}

export {render}
