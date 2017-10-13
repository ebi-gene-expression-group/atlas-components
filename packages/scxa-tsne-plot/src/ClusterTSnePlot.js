import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'

import ScatterPlotLoader from './plotloader/PlotLoader'

const _colourizeClusters = (highlightSeries) =>
  (series) => series.map((aSeries) => {
    // I can’t think of a better way to reconcile series.name being a string and highlightSeries being an array of
    // numbers. For more flexibility we might think of having our series be identified by an arbitrary ID string
    if (!highlightSeries.length || highlightSeries.map((hs) => String(hs)).includes(aSeries.name)) {
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
  const {ks, k, onChangeK, perplexities, perplexity, onChangePerplexity} = props  // Select
  const {plotData, highlightClusters, height} = props   // Chart
  const {loading, resourcesUrl, errorMessage} = props   // Overlay

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

  const perplexityOptions = perplexities.sort().map((perplexity) => (
    <option key={perplexity} value={perplexity}>{perplexity}</option>
  ))

  const kOptions = ks.sort().map((k) => (
    <option key={k} value={k}>{k}</option>
  ))

  return [
      <div key={`perplexity-k-select`} className={`row`}>
          <div className={`column medium-6`}>
              <label>Perplexity</label>
              <select value={perplexity} onChange={onChangePerplexity}>
                  {perplexityOptions}
              </select>
          </div>
          <div className={`column medium-6`}>
            <label>Number of clusters, <i>k</i></label>
            <select value={k} onChange={onChangeK}>
              {kOptions}
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

  ks: PropTypes.arrayOf(PropTypes.number).isRequired,
  k: PropTypes.number.isRequired,
  onChangeK: PropTypes.func.isRequired,

  perplexities: PropTypes.arrayOf(PropTypes.number).isRequired,
  perplexity: PropTypes.number.isRequired,
  onChangePerplexity: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string
}

export {ClusterTSnePlot as default, _colourizeClusters}
