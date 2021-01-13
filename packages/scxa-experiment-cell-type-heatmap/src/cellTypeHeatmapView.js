import React from 'react'

import CellTypeMarkerGeneHeatmap from './CellTypeMarkerGeneHeatmap'
import _ from 'lodash'

const cellTypeHeatmapView = (props, state) => {
  const { data } = state
  const { hasDynamicHeight, heatmapRowHeight, species, defaultHeatmapHeight } = props

  return  <CellTypeMarkerGeneHeatmap
    data={data}
    xAxisCategories={_.chain(data).uniqBy(`x`).sortBy(`x`).map(`cellTypeGroupValue`).value()}
    yAxisCategories={_.chain(data).uniqBy(`y`).sortBy(`y`).map(`geneName`).value()}
    chartHeight={defaultHeatmapHeight}
    hasDynamicHeight={_.chain(data).map(`geneName`).uniq().value().length > 5 ? hasDynamicHeight : false}
    heatmapRowHeight={heatmapRowHeight}
    species={species}
  />
}

export {cellTypeHeatmapView}
