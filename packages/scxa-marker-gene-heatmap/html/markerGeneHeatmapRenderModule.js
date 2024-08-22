import React from 'react'
import ReactDOM from 'react-dom'

import _ from 'lodash'

import MarkerGeneHeatmap from "../src/MarkerGeneHeatmap"
import cellTypeData from "./cell-types-data.json"
import clusterData from "./clusters-data.json"
import multiexperimentcelltypesData from "./multiexperiment-cell-types-data.json"

const dataList = {
  cellTypes: cellTypeData,
  clusters: clusterData,
  multiexperimentcelltypes: multiexperimentcelltypesData
}
const render = ({ data, species, heatmapType, defaultHeatmapHeight, hasDynamicHeight, heatmapRowHeight }, target) => {
  return (ReactDOM.render(
    <MarkerGeneHeatmap
      data={dataList[data]}
      xAxisCategories={_.chain(dataList[data]).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value()}
      yAxisCategories={_.chain(dataList[data]).uniqBy(`y`).sortBy(`y`).map(`geneName`).value()}
      chartHeight={defaultHeatmapHeight}
      hasDynamicHeight={_.chain(dataList[data]).map(`geneName`).uniq().value().length > 5 ? hasDynamicHeight : false}
      heatmapRowHeight={heatmapRowHeight}
      species={species}
      heatmapType={heatmapType}
      cellType={`Very Long Cell Type Title`}
    />, document.getElementById(target)))
}

export { render }
