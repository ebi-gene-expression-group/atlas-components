import React from 'react'
import ReactDOM from 'react-dom'

import FacetedSearchContainer from '../../src'

import ExperimentCard from './ExperimentCard'
import ExperimentsHeader from './ExperimentsHeader'
import results from './sampleResults.json'

const render = (options, target) => {
  ReactDOM.render(
    <FacetedSearchContainer
      results={results}
      sortTitle={`markerGenes`}
      ResultElementClass={ExperimentCard}
      ResultsHeaderClass={ExperimentsHeader}
    />,
    document.getElementById(target))
}

export {render}
