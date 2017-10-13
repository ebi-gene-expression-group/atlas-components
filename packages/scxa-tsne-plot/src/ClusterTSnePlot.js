import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'

import ScatterPlotLoader from './plotloader/PlotLoader'

const _colourizeClusters = (highlightSeries) =>
  (series) => series.map((aSeries) => {
    if (!highlightSeries.length || highlightSeries.includes(aSeries.name)) {
      return aSeries
    } else {
      return {
        name: aSeries.name,
        data: aSeries.data.map((point) => ({
          ...point,
          color: Color(`lightgrey`).alpha(0.65).rgb().toString()
        }))
      }
    }
  })

const ClusterTSnePlot = (props) => {
  const {availableClusters, k, perplexityArray, perplexity} = props                     // Select
  const {plotData, highlightClusters, height, onChange, onChangePerplexity} = props     // Chart
  const {loading, resourcesUrl, errorMessage} = props                                   // Overlay

  const highchartsConfig = {
    plotOptions: {
      scatter: {
        tooltip: {
          headerFormat: `<b>Cluster {series.name}</b><br>`,
          pointFormat: `{point.name}`
        }
      }
    },
    colors: [
              'rgba(178, 95, 188, 0.7)',
              'rgba(118, 179, 65, 0.7)',
              'rgba(104, 130, 207, 0.7)',
              'rgba(206, 155, 68, 0.7)',
              'rgba(200, 87, 123, 0.7)',
              'rgba(79, 174, 132, 0.7)',
              'rgba(201, 92, 63, 0.7)',
              'rgba(124, 127, 57, 0.7)'
            ],
    chart: {
      height: height
    }
  }

  const clusterOptions = availableClusters.sort().map((name, ix) => (
    <option key={ix} value={name}>{name}</option>
  ))

  const perplexityOptions = perplexityArray.sort().map((name, ix) => (
    <option key={ix} value={name}>{name}</option>
  ))

  return [
      <div className={`row`}>
          <div key={`cluster-select`} className={`column medium-6`}>
            <label>Number of clusters, <i>k</i></label>
            <select value={k} onChange={onChange}>
              {clusterOptions}
            </select>
          </div>

          <div key={`perplexity-select`} className={`column medium-6`}>
              <label>Perplexity, <i>perplexity</i></label>
              <select value={perplexity} onChange={onChangePerplexity}>
                  {perplexityOptions}
              </select>
          </div>
      </div>,

      <ScatterPlotLoader key={`cluster-plot`}
                         wrapperClassName={`row column`}
                         series={_colourizeClusters(highlightClusters)(plotData.series)}
                         highchartsConfig={highchartsConfig}
                         loading={loading}
                         resourcesUrl={resourcesUrl}
                         errorMessage={errorMessage}
      />
  ]
}

ClusterTSnePlot.propTypes = {
  height: PropTypes.number.isRequired,

  plotData: PropTypes.shape({
    series: PropTypes.array.isRequired
  }),
  highlightClusters: PropTypes.array,

  availableClusters: PropTypes.array.isRequired,
  k: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string
}

export {ClusterTSnePlot as default, _colourizeClusters}
