import React from 'react'

import CellTypeMarkerGeneHeatmap from './CellTypeMarkerGeneHeatmap'
import _ from 'lodash'

const cellTypeHeatmapView = (props, state) => {
  console.log(`data`, data)
  const { data } = state
  const { defaultHeatmapHeight } = props
  const { hasDynamicHeight, heatmapRowHeight, species } = props

  const markerGeneHeatmap = <CellTypeMarkerGeneHeatmap
    data={data}
    isDataFiltered={false}
    xAxisCategories={_.uniq(data.map(cell => cell.cellType))}
    yAxisCategories={_.uniq(data.map(cell => cell.geneName))}
    chartHeight={defaultHeatmapHeight}
    hasDynamicHeight={_.chain(data).map(`geneName`).uniq().value().length > 5 ? hasDynamicHeight : false}
    heatmapRowHeight={heatmapRowHeight}
    species={species}
  />


  return [markerGeneHeatmap]
}

export {cellTypeHeatmapView}