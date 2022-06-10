import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import _ from 'lodash'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import CellTypeWheel from '@ebi-gene-expression-group/scxa-cell-type-wheel'
import MarkerGeneHeatmap from '@ebi-gene-expression-group/scxa-marker-gene-heatmap/lib/MarkerGeneHeatmap'

const CellTypeWheelFetchLoader = withFetchLoader(CellTypeWheel)
const MarkerGeneHeatmapFetchLoader = withFetchLoader(MarkerGeneHeatmap)

class CellTypeWheelExperimentHeatmap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cellType: ``,
      species: ``,
      experimentAccessions: []
    }
  }

  _onCellTypeWheelClick (cellType, species, experimentAccessions) {
    this.setState({
      cellType,
      species,
      experimentAccessions
    })
  }

  render () {
    const { host, cellTypeWheelResource, heatmapResource, searchTerm } = this.props
    const { cellType, species, experimentAccessions } = this.state
    const onCellTypeWheelClick = this._onCellTypeWheelClick.bind(this)
    const heatmapProps = {
      hasDynamicHeight: true
    }

    return (
      <div className={`row-expanded`}>
        <div className={`small-12 medium-6 columns`}>
          <CellTypeWheelFetchLoader
            host={host}
            resource={URI(searchTerm, cellTypeWheelResource).toString()}
            fulfilledPayloadProvider={ cellTypeWheelData => ({ data: cellTypeWheelData }) }
            searchTerm = {searchTerm}
            onCellTypeWheelClick={onCellTypeWheelClick}
          />
        </div>
        <div className={`small-12 medium-6 columns`}>
          {cellType ?
            <MarkerGeneHeatmapFetchLoader
              host={host}
              resource={URI(cellType, heatmapResource).toString()}
              fulfilledPayloadProvider={
                heatmapData => ({
                  data: heatmapData,
                  xAxisCategories: _.chain(heatmapData).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value(),
                  yAxisCategories: _.chain(heatmapData).uniqBy(`y`).sortBy(`y`).map(`geneName`).value(),
                  hasDynamicHeight: _.chain(heatmapData).map(`geneName`).uniq().value().length > 5 ? heatmapProps.hasDynamicHeight : false
                })
              }
              query={{ experimentAccessions }}
              cellType={cellType}
              heatmapRowHeight={40}
              species={species}
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
