import React, { useState } from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import _ from 'lodash'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import CellTypeWheel from '@ebi-gene-expression-group/scxa-cell-type-wheel'
import MarkerGeneHeatmap from '@ebi-gene-expression-group/scxa-marker-gene-heatmap/lib/MarkerGeneHeatmap'

const CellTypeWheelFetchLoader = withFetchLoader(CellTypeWheel)
const MarkerGeneHeatmapFetchLoader = withFetchLoader(MarkerGeneHeatmap)

function CellTypeWheelExperimentHeatmap (props) {
  const [heatmapSelection, setHeatmapSelection] = useState({
    cellType: ``,
    species: ``,
    experimentAccessions: []
  })

  const onCellTypeWheelClick = (cellType, species, experimentAccessions) => setHeatmapSelection({
    cellType,
    species,
    experimentAccessions
  })

  const heatmapFulfilledPayloadProvider = heatmapData => ({
    data: heatmapData,
    xAxisCategories: _.chain(heatmapData).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value(),
    yAxisCategories: _.chain(heatmapData).uniqBy(`y`).sortBy(`y`).map(`geneName`).value(),
    hasDynamicHeight: _.chain(heatmapData).map(`geneName`).uniq().value().length > 5
  })

  return (
    <div className={`row-expanded`}>
      <div className={`small-12 medium-6 columns`}>
        <CellTypeWheelFetchLoader
          host={props.host}
          resource={URI(props.searchTerm, props.cellTypeWheelResource).toString()}
          fulfilledPayloadProvider={ cellTypeWheelData => ({ data: cellTypeWheelData }) }
          searchTerm={props.searchTerm}
          onCellTypeWheelClick={onCellTypeWheelClick}
        />
      </div>
      <div className={`small-12 medium-6 columns`}>
        {heatmapSelection.cellType ?
          <MarkerGeneHeatmapFetchLoader
            host={props.host}
            resource={URI(heatmapSelection.cellType, props.heatmapResource).toString()}
            fulfilledPayloadProvider={heatmapFulfilledPayloadProvider}
            query={heatmapSelection.experimentAccessions}
            cellType={heatmapSelection.cellType}
            heatmapRowHeight={40}
            species={heatmapSelection.species}
            heatmapType={`multiexperimentcelltypes`}
          /> :
          <div className={`medium-text-center`}>
            <h4>
            Please click on a cell type to see a detailed view of the expression profile of marker genes across experiments.
            </h4>
          </div>
        }
      </div>
    </div>
  )
}

CellTypeWheelExperimentHeatmap.propTypes = {
  host: PropTypes.string,
  cellTypeWheelResource: PropTypes.string,
  heatmapResource: PropTypes.string,
  searchTerm: PropTypes.string.isRequired
}

CellTypeWheelExperimentHeatmap.defaultProps = {
  host: `/gxa/sc/`,
  cellTypeWheelResource: `json/cell-type-wheel/`,
  heatmapResource: `json/cell-type-marker-genes/`
}

export default CellTypeWheelExperimentHeatmap
