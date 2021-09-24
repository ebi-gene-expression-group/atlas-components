import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import MarkerGeneHeatmap from '@ebi-gene-expression-group/scxa-marker-gene-heatmap/lib/MarkerGeneHeatmap'
import CellTypeWheel from '@ebi-gene-expression-group/scxa-cell-type-wheel'

class CellTypeWheelExperimentHeatmap extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { cellTypeWheelData, cellTypeWheelSearchTerm, cellTypeHeatmapSearchTerm, cellTypeHeatmapData } = this.props
    const heatmapProps = {
      hasDynamicHeight: true
    }

    return (
      <div className={`row-expanded`}>
        <div className={`small-12 medium-6 columns`}>
          <CellTypeWheel
            data = {cellTypeWheelData}
            searchTerm = {cellTypeWheelSearchTerm}
          />
        </div>
        <div className={`small-12 medium-6 columns`}>
          <MarkerGeneHeatmap
            cellType={cellTypeHeatmapSearchTerm}
            data={cellTypeHeatmapData}
            xAxisCategories={_.chain(cellTypeHeatmapData).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value()}
            yAxisCategories={_.chain(cellTypeHeatmapData).uniqBy(`y`).sortBy(`y`).map(`geneName`).value()}
            hasDynamicHeight={_.chain(cellTypeHeatmapData).map(`geneName`).uniq().value().length > 5 ? heatmapProps.hasDynamicHeight : false}
            heatmapRowHeight={40}
            species={`Homo sapiens`}
            heatmapType={`celltypes`}
          />
        </div>
      </div>
    )
  }
}

CellTypeWheelExperimentHeatmap.propTypes = {
  // cellTypeHeatmapData: PropTypes.arrayOf(PropTypes.shape({
  //   data: PropTypes.object.isRequired,
  //   species: PropTypes.string.isRequired,
  // })).isRequired,
  cellTypeWheelSearchTerm: PropTypes.string.isRequired,
  cellTypeWheelData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
    value: PropTypes.number
  })).isRequired
}

export default CellTypeWheelExperimentHeatmap