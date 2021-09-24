import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeWheelExperimentHeatmap from '../src/index.js'

import cellTypeWheelData from './data/leukocyte-sunburst.json'
import heatmapData from './data/homo-sapiens-blood-t-cell-heatmap.json'
const cellTypeWheelTitle = `leukocyte`
const heatmapTitle = `T cell`

//import cellTypeWheelData from './data/lung-sunburst.json'
//import heatmapData from './data/cd.json'
//const cellTypeWheelTitle = `lung`
//const heatmapTitle = `CD4-positive, alpha-beta T cell`

const render = (options, target) => {
  ReactDOM.render(
    <CellTypeWheelExperimentHeatmap
      {...options}
      cellTypeWheelSearchTerm={cellTypeWheelTitle}
      cellTypeWheelData={cellTypeWheelData}
      cellTypeHeatmapSearchTerm={heatmapTitle}
      cellTypeHeatmapData={heatmapData}
    />, document.getElementById(target)
  )
}

export { render }