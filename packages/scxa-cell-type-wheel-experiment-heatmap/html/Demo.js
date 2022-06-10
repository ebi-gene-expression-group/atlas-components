import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeWheelExperimentHeatmap from '../src/index.js'
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

const CellTypeWheelExperimentHeatmapWithFetchLoader = withFetchLoader(CellTypeWheelExperimentHeatmap)

const render = (options, target) => {
  ReactDOM.render(
    <CellTypeWheelExperimentHeatmapWithFetchLoader
      {...options}
      host={`https://wwwdev.ebi.ac.uk/gxa/sc/`}
      resource={`json/cell-type-wheel/pancreas`}
      fulfilledPayloadProvider={
        data => ({ cellTypeWheelData: data })
      }
      cellTypeWheelSearchTerm={`pancreas`}
    />, document.getElementById(target)
  )
}

export { render }
