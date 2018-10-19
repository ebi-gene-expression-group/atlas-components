import React from 'react'
import ReactDOM from 'react-dom'

import SpeciesCard from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<SpeciesCard {...options} />, document.getElementById(target))
}

export {render}
