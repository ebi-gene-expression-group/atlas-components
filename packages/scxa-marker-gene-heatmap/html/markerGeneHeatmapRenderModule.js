import React from 'react'
import ReactDOM from 'react-dom'

import _ from 'lodash'

import MarkerGeneHeatmap from "../src/MarkerGeneHeatmap";

const render = ({ data, species, heatmapType, defaultHeatmapHeight, hasDynamicHeight, heatmapRowHeight }, target) => {
  ReactDOM.render(
    <MarkerGeneHeatmap
      data={data}
      xAxisCategories={_.chain(data).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value()}
      yAxisCategories={_.chain(data).uniqBy(`y`).sortBy(`y`).map(`geneName`).value()}
      chartHeight={defaultHeatmapHeight}
      hasDynamicHeight={_.chain(data).map(`geneName`).uniq().value().length > 5 ? hasDynamicHeight : false}
      heatmapRowHeight={heatmapRowHeight}
      species={species}
      heatmapType={heatmapType}
      cellType={`Very Long Cell Type Title`}
    />, document.getElementById(target))
}

export { render }
