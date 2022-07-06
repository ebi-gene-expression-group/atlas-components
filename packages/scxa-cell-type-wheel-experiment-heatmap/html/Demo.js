import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeWheelExperimentHeatmap from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(
    <CellTypeWheelExperimentHeatmap
      {...options}
      host={`https://wwwdev.ebi.ac.uk/gxa/sc/`}
      searchTerm={`pancreas`}
    />, document.getElementById(target)
  )
}

export { render }
