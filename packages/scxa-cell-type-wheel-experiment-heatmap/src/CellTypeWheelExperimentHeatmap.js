import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import MarkerGeneHeatmap from '@ebi-gene-expression-group/scxa-marker-gene-heatmap/lib/MarkerGeneHeatmap'
import CellTypeWheel from '@ebi-gene-expression-group/scxa-cell-type-wheel'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

const MarkerGeneHeatmapFetchLoader = withFetchLoader(MarkerGeneHeatmap)

class CellTypeWheelExperimentHeatmap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cellTypeHeatmapSearchTerm: ``
    }
  }

  _onCellTypeWheelClick(cellType) {
    this.setState({
      cellTypeHeatmapSearchTerm: cellType
    })
  }

  render() {
    const { cellTypeHeatmapSearchTerm, cellTypeHeatmapData } = this.state
    const { atlasUrl, heatmapResource, cellTypeWheelData, cellTypeWheelSearchTerm } = this.props
    const heatmapProps = {
      hasDynamicHeight: true
    }

    return (
      <div className={`row-expanded`}>
        <div className={`small-12 medium-6 columns`}>
          <CellTypeWheel
            data = {cellTypeWheelData}
            searchTerm = {cellTypeWheelSearchTerm}
            onCellTypeWheelClick={(cellType) => this._onCellTypeWheelClick(cellType)}
          />
        </div>
        <div className={`small-12 medium-6 columns`}>
          {cellTypeHeatmapSearchTerm
            ? <MarkerGeneHeatmapFetchLoader
              host={atlasUrl}
              resource={heatmapResource + cellTypeHeatmapSearchTerm}
              cellType={cellTypeHeatmapSearchTerm}
              fulfilledPayloadProvider={data => ({
                cellTypeHeatmapData: data
              })
              }
              xAxisCategories={_.chain(cellTypeHeatmapData).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value()}
              yAxisCategories={_.chain(cellTypeHeatmapData).uniqBy(`y`).sortBy(`y`).map(`geneName`).value()}
              hasDynamicHeight={_.chain(cellTypeHeatmapData).map(`geneName`).uniq().value().length > 5 ? heatmapProps.hasDynamicHeight : false}
              heatmapRowHeight={40}
              species={`Homo sapiens`}
              heatmapType={`celltypes`}
            />
            : <div className={`medium-text-center`}>
                  This is placeholder. When you click outer ring of Cell Type then the Heatmap will be displayed here
            </div>
          }
        </div>
      </div>
    )
  }
}

CellTypeWheelExperimentHeatmap.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  heatmapResource: PropTypes.string.isRequired,
  cellTypeWheelSearchTerm: PropTypes.string.isRequired,
  cellTypeWheelData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      parent: PropTypes.string.isRequired,
      value: PropTypes.number
    })).isRequired
  /*cellTypeHeatmapSearchTerm: PropTypes.string.isRequired,
  cellTypeHeatmapData: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      geneName: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      cellGroupValue: PropTypes.string.isRequired,
      cellGroupValueWhereMarker: PropTypes.string.isRequired,
      pValue: PropTypes.number.isRequired
    })).isRequired*/
}

CellTypeWheelExperimentHeatmap.defaultProps = {
  atlasUrl: `http://localhost:8080/gxa/sc/`,
  heatmapResource: `json/cell-type-marker-genes/`
}

export default CellTypeWheelExperimentHeatmap
