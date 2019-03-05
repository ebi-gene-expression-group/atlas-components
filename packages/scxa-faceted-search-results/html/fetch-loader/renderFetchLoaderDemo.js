import React from 'react'
import ReactDOM from 'react-dom'

import FetchLoader from '../../src/FetchLoader'
import ExperimentTableCard from '../ExperimentTableCard'
import ExperimentTableHeader from '../ExperimentTableHeader'

const render = (options, target) => {
  ReactDOM.render(
    <FetchLoader
      {...options}
      ResultElementClass={ExperimentTableCard}
      ResultsHeaderClass={ExperimentTableHeader} />,
    document.getElementById(target))
}

export {render}
