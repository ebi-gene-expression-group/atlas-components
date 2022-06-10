import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import _ from 'lodash'

import MarkerGeneHeatmap from '@ebi-gene-expression-group/scxa-marker-gene-heatmap/lib/MarkerGeneHeatmap'
import CellTypeWheel from '@ebi-gene-expression-group/scxa-cell-type-wheel'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

const MarkerGeneHeatmapFetchLoader = withFetchLoader(MarkerGeneHeatmap)

class CellTypeWheelExperimentHeatmap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cellTypeHeatmapSearchTerm: ``,
      species: ``,
      experimentAccessions: []
    }
  }

  _onCellTypeWheelClick (cellType, species, experimentAccessions) {
    this.setState({
      cellTypeHeatmapSearchTerm: cellType,
      species,
      experimentAccessions
    })
  }

  render () {
    const { cellTypeHeatmapSearchTerm, species, experimentAccessions } = this.state
    const { host, heatmapResource, cellTypeWheelData, cellTypeWheelSearchTerm } = this.props
    const heatmapProps = {
      hasDynamicHeight: true
    }

    return (
      <div className={`row-expanded`}>
        <div className={`small-12 medium-6 columns`}>
          <CellTypeWheel
            data = {cellTypeWheelData}
            searchTerm = {cellTypeWheelSearchTerm}
            onCellTypeWheelClick={(cellType, species, experimentAccessions) => this._onCellTypeWheelClick(cellType, species, experimentAccessions)}
          />
        </div>
        <div className={`small-12 medium-6 columns`}>
          {cellTypeHeatmapSearchTerm ?
            <MarkerGeneHeatmapFetchLoader
              host={host}
              resource={URI(cellTypeHeatmapSearchTerm, heatmapResource).toString()}
              query={{ experimentAccessions }}
              cellType={cellTypeHeatmapSearchTerm}
              fulfilledPayloadProvider={
                heatmapData => ({
                  data: heatmapData,
                  xAxisCategories: _.chain(heatmapData).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value(),
                  yAxisCategories: _.chain(heatmapData).uniqBy(`y`).sortBy(`y`).map(`geneName`).value(),
                  hasDynamicHeight: _.chain(heatmapData).map(`geneName`).uniq().value().length > 5 ? heatmapProps.hasDynamicHeight : false
                })
              }
              heatmapRowHeight={40}
              species={species}
              heatmapType={`multiexperimentcelltypes`}
            /> :
            <div className={`medium-text-center`}>
              <h2>
              Please click on a cell type to see a detailed view of the expression profile of marker genes across experiments.
              </h2>
            </div>
          }
        </div>
      </div>
    )
  }
}

CellTypeWheelExperimentHeatmap.propTypes = {
  host: PropTypes.string,
  heatmapResource: PropTypes.string.isRequired,
  cellTypeWheelSearchTerm: PropTypes.string.isRequired,
  cellTypeWheelData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      parent: PropTypes.string.isRequired,
      value: PropTypes.number
    })).isRequired
}

CellTypeWheelExperimentHeatmap.defaultProps = {
  host: `/gxa/sc/`,
  heatmapResource: `json/cell-type-marker-genes/`
}

export default CellTypeWheelExperimentHeatmap
