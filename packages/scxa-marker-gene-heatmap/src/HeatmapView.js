import React from 'react'
import PropTypes from 'prop-types'
import MarkerGeneHeatmap from './MarkerGeneHeatmap'
import PlotSettingsDropdown from './PlotSettingsDropdown'
import LoadingOverlay from './LoadingOverlay'
import CalloutAlert from './CalloutAlert'

import URI from 'urijs'
import _ from 'lodash'

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
    const { data, filteredData, selectedClusterId, isLoading, hasError } = this.state
    const { wrapperClassName, plotWrapperClassName } = this.props
    const { ks, ksWithMarkers, selectedK, onSelectK } = this.props
    const { hasDynamicHeight, defaultHeatmapHeight, heatmapRowHeight } = this.props

    const kOptions = ks
      .sort((a, b) => a-b)
      .map((k) => ({
        value: k.toString(),
        label: `k = ${k}`,
        isDisabled: ksWithMarkers ? !ksWithMarkers.includes(k) : false
    }))

    const allClusterIds = _.range(1, parseInt(selectedK) + 1)
    const clusterIdsWithMarkers = data && _.uniq(data.map(x => x.clusterIdWhereMarker))

    const clusterIdOptions = allClusterIds
      .sort((a, b) => a-b)
      .map((clusterId) => ({
        value: clusterId.toString(),
        label: `Cluster ${clusterId}`,
        isDisabled: clusterIdsWithMarkers ? !clusterIdsWithMarkers.includes(clusterId) : false
      }))

    // Add default "All clusters" option at the start of the options array
    clusterIdOptions.unshift({
      value: `all`,
      label: `All clusters`,
      isDisabled: false // always show this option
    })

    return (
      hasError ?
        <CalloutAlert error={hasError}/> :
        <div>
          <div className={wrapperClassName}>
            <div className={`small-12 medium-6 columns`}>
              <PlotSettingsDropdown
                labelText={`Number of clusters:`}
                options={kOptions}
                onSelect={(selectedOption) => onSelectK(selectedOption.value)}
                value={{value: selectedK, label: `k = ${selectedK}`}}
              />
            </div>
            <div className={`small-12 medium-6 columns`}>
              <PlotSettingsDropdown
                labelText={`Show marker genes for:`}
                options={clusterIdOptions}
                onSelect={(selectedOption) => {
                  this.setState((state, props) => ({
                    data: _.cloneDeep(state.data),
                    filteredData: selectedOption.value === `all` ?
                      _.cloneDeep(state.data) :
                      _.filter(state.data, {'clusterIdWhereMarker': parseInt(selectedOption.value)}),
                    selectedClusterId: selectedOption
                  }))
                }}
                value={selectedClusterId || clusterIdOptions[0]}
              />
            </div>
          </div>
          <div className={wrapperClassName}>
            <div className={plotWrapperClassName} style={{position: `relative`}}>
              <MarkerGeneHeatmap
                data={filteredData}
                isDataFiltered={selectedClusterId && selectedClusterId.value !== `all` || false}
                xAxisCategories={allClusterIds}
                yAxisCategories={ _.uniq(data.map(x => x.name))}
                chartHeight={defaultHeatmapHeight}
                hasDynamicHeight={_.uniq(filteredData.map(x => x.name)).length > 5 ? hasDynamicHeight : false} // don't want dynamic height if there is little or no data
                heatmapRowHeight={heatmapRowHeight}
              />
              <LoadingOverlay
                show={isLoading}
              />
            </div>
          </div>
        </div>
    )
  }
}

HeatmapView.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  ks: PropTypes.arrayOf(PropTypes.number).isRequired,
  ksWithMarkers: PropTypes.arrayOf(PropTypes.number),
  selectedK: PropTypes.string.isRequired,
  onSelectK: PropTypes.func,
  wrapperClassName: PropTypes.string,
  plotWrapperClassName: PropTypes.string,
  defaultHeatmapHeight: PropTypes.number,
  hasDynamicHeight: PropTypes.bool,
  heatmapRowHeight: PropTypes.number
}

HeatmapView.defaultProps = {
  wrapperClassName: `row`,
  plotWrapperClassName: `medium-12 columns`,
  defaultHeatmapHeight: 300,
  hasDynamicHeight: true,
  heatmapRowHeight: 20
}

export default HeatmapView