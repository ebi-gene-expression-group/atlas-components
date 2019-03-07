import React from 'react'
import ReactDOM from 'react-dom'

import FetchLoader from '../../src/FetchLoader'
import ExperimentCard from './ExperimentCard'
import ExperimentsHeader from './ExperimentsHeader'

const render = (options, target) => {
  ReactDOM.render(
    <FetchLoader
      {...options}
      sortTitle={`markerGenes`}
      ResultElementClass={ExperimentCard}
      ResultsHeaderClass={ExperimentsHeader} />,
    document.getElementById(target))
}

export {render}
