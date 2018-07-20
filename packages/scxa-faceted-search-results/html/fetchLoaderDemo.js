import React from 'react'
import ReactDOM from 'react-dom'

import FetchLoader from '../src/FetchLoader'

import ExperimentCard from './ExperimentCard'

const render = (options, target) => {
  ReactDOM.render(<FetchLoader {...options}
                               ResultElementClass={ExperimentCard}/>, document.getElementById(target))
}

export {render}
