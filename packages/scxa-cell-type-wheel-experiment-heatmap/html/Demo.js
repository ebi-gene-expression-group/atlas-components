import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeWheelExperimentHeatmap from '../src/index.js'

import tcell from './data/tcell-sunburst.json'
import heatmapData from './data/heatmap-data.json'

const render = (options, target) => {
  ReactDOM.render(
    <CellTypeWheelExperimentHeatmap
      {...options}
      cellTypeWheelData={tcell}
      cellTypeHeatmapData={heatmapData}
    />, document.getElementById(target)
  )
}

export { render }