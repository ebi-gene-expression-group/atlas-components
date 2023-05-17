import React from 'react'
import ReactDOM from 'react-dom'

import FacetedSearchContainer from '../../src/index'
import ExperimentCard from "./ExperimentCard";
import ExperimentsHeader from "./ExperimentsHeader";

const render = (options, target) => {
  ReactDOM.render(
    <FacetedSearchContainer
      {...options}
      ResultElementClass={ExperimentCard}
      ResultsHeaderClass={ExperimentsHeader}
    />,
    document.getElementById(target))
}

export {render}
