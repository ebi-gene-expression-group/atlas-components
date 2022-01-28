import React from 'react'
import PropTypes from 'prop-types'
import MarkerGeneHeatmap from '../MarkerGeneHeatmap'
import PlotSettingsDropdown from './PlotSettingsDropdown'
import PlotSettingsDropdown2 from './PlotSettingsDropdown2'
import LoadingOverlay from '../LoadingOverlay'
import CalloutAlert from '../CalloutAlert'

import URI from 'urijs'
import {find as _find, flatten as _flatten} from 'lodash'

class HeatmapView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      filteredData: [],
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
      const response = await fetch([url])

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      const jsonData = await response.json()
      this.setState({
        data: await jsonData,
        filteredData: await jsonData,
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
    const { data, filteredData, isLoading, hasError } = this.state
    const { wrapperClassName, plotWrapperClassName } = this.props
    const { ks, ksWithMarkers, selectedColourBy, onChangeColourBy, metadata, cellTypes, selectedColourByCategory, selectedClusterId} = this.props
    const { hasDynamicHeight, defaultHeatmapHeight, heatmapRowHeight, species, host } = this.props

    const kOptions = ks
      .sort((a, b) => a-b)
      .map((k) => ({
        value: k.toString(),
        label: `k = ${k}`,
        isDisabled: ksWithMarkers ? !ksWithMarkers.includes(k.toString()) : false
      }))

    const metadataOptions = metadata.map((metadata) => ({
      ...metadata,
      group: `metadata`
    }))

    const options = [
      {
        label: `Metadata`,
        options: metadataOptions,
      },
      {
        label: `Number of clusters`,
        options: kOptions,
      },
    ]

    const defaultValue = _find(
        _flatten(
            options.map((item) => (item.options))
        ),
        {value: selectedColourBy}
    )

    const allClusterIds = selectedColourByCategory == `clusters` ?
        _.range(1, parseInt(selectedColourBy) + 1) :
        cellTypes

    //TODO
    const clusterIdsWithMarkers = data && _.uniq(data.map(x => parseInt(x.cellGroupValueWhereMarker)))

    const clusterIdOptions = selectedColourByCategory == `clusters` ?
        allClusterIds
          .sort((a, b) => a-b)
          .map((clusterId) => ({
            value: clusterId.toString(),
            label: `Cluster ${clusterId}`,
            isDisabled: clusterIdsWithMarkers ? !clusterIdsWithMarkers.includes(clusterId) : false
          })) :
        allClusterIds
          .sort((a, b) => a-b)
          .map((clusterId) => ({
            value: clusterId.toLowerCase(),
            label: clusterId,
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
              <PlotSettingsDropdown2
                  labelText={`Colour plot by:`}
                  options={metadata ? options : kOptions} // Some experiments don't have metadata in Solr, although they should do. Leaving this check in for now so we don't break the entire experiment page.
                  defaultValue={defaultValue}
                  onSelect={(selectedOption) => {
                    onChangeColourBy(selectedOption.group, selectedOption.value)
                  }}/>
            </div>
            <div className={`small-12 medium-6 columns`}>
              <PlotSettingsDropdown
                labelText={`Show marker genes for:`}
                options={clusterIdOptions}
                onSelect={(selectedOption) => {
                  this.setState((state) => ({
                    data: _.cloneDeep(state.data),
                    filteredData: selectedOption.value === `all` ?
                      _.cloneDeep(state.data) :
                      _.filter(state.data, {'cellGroupValueWhereMarker': selectedOption.value}),
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
                yAxisCategories={_.chain(data).map(cell => _.pick(cell, `geneName`, `cellGroupValueWhereMarker`)).uniqWith(_.isEqual).map(`geneName`).value()}
                chartHeight={defaultHeatmapHeight}
                hasDynamicHeight={_.chain(filteredData).map(`geneName`).uniq().value().length > 5 ? hasDynamicHeight : false}
                heatmapRowHeight={heatmapRowHeight}
                species={species}
                host={host}
                heatmapType={`clusters`}
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
  ksWithMarkers: PropTypes.arrayOf(PropTypes.string),
  selectedColourBy: PropTypes.string.isRequired,
  selectedColourByCategory: PropTypes.string.isRequired,
  onSelectK: PropTypes.func,
  wrapperClassName: PropTypes.string,
  plotWrapperClassName: PropTypes.string,
  defaultHeatmapHeight: PropTypes.number,
  hasDynamicHeight: PropTypes.bool,
  heatmapRowHeight: PropTypes.number,
  species: PropTypes.string.isRequired
}

HeatmapView.defaultProps = {
  wrapperClassName: `row`,
  plotWrapperClassName: `small-12 columns`,
  defaultHeatmapHeight: 300,
  hasDynamicHeight: true,
  heatmapRowHeight: 20
}

export default HeatmapView
