import React from 'react'
import ReactDOM from 'react-dom'

import SpeciesSelect from '../src/SpeciesSelect'

const render = (options, target) => {
  ReactDOM.render(<SpeciesSelect {...options} />, document.getElementById(target))
}

export {render}
