import React from 'react'
import PropTypes from 'prop-types'
import LoadingOverlay from './LoadingOverlay'
import CalloutAlert from './CalloutAlert'
import URI from 'urijs'
import _ from "lodash";

import heatmapOptionsProvider from './heatmapOptionsProvider'
import MarkerGeneHeatmap from "./MarkerGeneHeatmap"

class HeatmapView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      filteredData: [],
      selectedClusterId: null,
      isLoading: true,
      hasError: null
    }
  }

  async _fetchAndSetState({resource, host}) {
    this.setState({
      isLoading: true
    })

    const url = URI(resource, host).toString()
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      const jsonData = await response.json()
      this.setState({
        data: await jsonData,
        filteredData: await jsonData,
        selectedClusterId: null,
        isLoading: false,
        hasError: null
      })
    } catch(e) {
      console.log(`catch`)

      this.setState({
        data: null,
        isLoading: false,
        hasError: {
          description: `There was a problem communicating with the server. Please try again later.`,
          name: e.name,
          message: e.message
        }
      })
    }
  }

  componentDidMount() {
    this._fetchAndSetState(this.props)
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resource !== this.props.resource) {
      this._fetchAndSetState(this.props)
    }
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: {
        description: `There was a problem rendering this component.`,
        name: error.name,
        message: `${error.message} – ${info}`
      }
    })
  }

  render() {
    const { isLoading, hasError, data } = this.state
    const { wrapperClassName, plotWrapperClassName, heatmapType } = this.props
    const { host, defaultHeatmapHeight, hasDynamicHeight, heatmapRowHeight, species } = this.props

    return (
      hasError ?
        <CalloutAlert error={hasError}/> :
          <div className={wrapperClassName}>
            <div className={plotWrapperClassName} style={{position: `relative`}}>
              <MarkerGeneHeatmap
                data={data}
                xAxisCategories={_.chain(data).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value()}
                yAxisCategories={_.chain(data).uniqBy(`y`).sortBy(`y`).map(`geneName`).value()}
                chartHeight={defaultHeatmapHeight}
                hasDynamicHeight={_.chain(data).map(`geneName`).uniq().value().length > 5 ? hasDynamicHeight : false}
                heatmapRowHeight={heatmapRowHeight}
                species={species}
                heatmapType={heatmapType}
                host={host}
              />
              <LoadingOverlay
                show={isLoading}
              />
            </div>
          </div>
    )
  }
}

HeatmapView.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  species: PropTypes.string.isRequired,
  heatmapType: PropTypes.oneOf(Object.keys(heatmapOptionsProvider)).isRequired,
  wrapperClassName: PropTypes.string,
  plotWrapperClassName: PropTypes.string,
  defaultHeatmapHeight: PropTypes.number,
  hasDynamicHeight: PropTypes.bool,
  heatmapRowHeight: PropTypes.number
}

HeatmapView.defaultProps = {
  wrapperClassName: ``,
  plotWrapperClassName: ``,
  defaultHeatmapHeight: 300,
  hasDynamicHeight: true,
  heatmapRowHeight: 20
}

export default HeatmapView
