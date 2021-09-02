import React from 'react'
import PropTypes from 'prop-types'

import CellTypeHeatmap from '@ebi-gene-expression-group/scxa-cell-type-marker-gene-heatmap'
import CellTypeWheel from 'expression-atlas-my-package'

class CellTypeWheelExperimentHeatmap extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    const {cellTypeWheelData, cellTypeHeatmapData} = this.props

    const heatMapProps = {
      resource: ``,
      host: `https://gist.githubusercontent.com/haideriqbal/70170f9b03a9de271829854a13d7854d/raw/ca14d3dfa773ffc7feaf4bfe8d126c11d8ce97f3/test.json`,
      type:`cellType`,
      props: {
        species: `Homo sapiens`,
        hasDynamicHeight: true,
        heatmapRowHeight: 20,
        wrapperClassName: `row expanded`,
        data: cellTypeHeatmapData
      }
    }

    return (
      <div className={`row`}>
        <div className={`small-12 medium-6 columns`}>
          <CellTypeWheel data = {cellTypeWheelData} />
        </div>
        <div className={`small-12 medium-6 columns`}>
          <CellTypeHeatmap {...heatMapProps}/>
        </div>
      </div>
    )
  }
}

CellTypeWheelExperimentHeatmap.propTypes = {
  cellTypeHeatmapData: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    geneName: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    cellGroupValueWhereMarker: PropTypes.string.isRequired,
    cellGroupValue: PropTypes.string.isRequired
  })).isRequired,
  cellTypeWheelData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
    value: PropTypes.number
  })).isRequired
}

export default CellTypeWheelExperimentHeatmap