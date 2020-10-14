import React from 'react'

import CellTypeMarkerGeneHeatmap from './CellTypeMarkerGeneHeatmap'
import _ from 'lodash'

const cellTypeHeatmapView = (props, state) => {
  const { data } = state
  const { hasDynamicHeight, heatmapRowHeight, species, defaultHeatmapHeight } = props

  return  <CellTypeMarkerGeneHeatmap
    data={data}
    isDataFiltered={false}
    xAxisCategories={_.uniq(data.map(cell => cell.cellType))}
    yAxisCategories={_.uniq(data.map(cell => cell.geneName))}
    chartHeight={defaultHeatmapHeight}
    hasDynamicHeight={_.chain(data).map(`geneName`).uniq().value().length > 5 ? hasDynamicHeight : false}
    heatmapRowHeight={heatmapRowHeight}
    species={species}
  />
}

export {cellTypeHeatmapView}