import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'

import ScatterPlotLoader from './plotloader/PlotLoader'

const _colourizeClusters = (highlightSeries) =>
  (series) => series.map((aSeries) => {
    // I can’t think of a better way to reconcile series.name being a string and highlightSeries being an array of
    // numbers. For more flexibility we might think of having our series be identified by an arbitrary ID string
    if (!highlightSeries.length || highlightSeries.length === series.length || highlightSeries.map((hs) => `Cluster ${hs}`).includes(aSeries.name)) {
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
  const {ks, selectedK, onChangeK, perplexities, selectedPerplexity, onChangePerplexity} = props  // Select
  const {plotData, highlightClusters, height, tooltipContent} = props   // Chart
  const {loading, resourcesUrl, errorMessage} = props   // Overlay

  const highchartsConfig = {
    plotOptions: {
      scatter: {
        marker: {
          symbol: `circle`
        }
      }
    },
    // Generated with http://tools.medialab.sciences-po.fr/iwanthue/
    colors: [
      `rgba(212, 137, 48, 0.7)`,
      `rgba(71, 193, 152, 0.7)`,
      `rgba(193, 84, 47, 0.7)`,
      `rgba(90, 147, 221, 0.7)`,
      `rgba(194, 73, 97, 0.7)`,
      `rgba(128, 177, 66, 0.7)`,
      `rgba(208, 76, 134, 0.7)`,
      `rgba(188, 176, 59, 0.7)`,
      `rgba(132, 43, 102, 0.7)`,
      `rgba(93, 188, 108, 0.7)`,
      `rgba(82, 45, 128, 0.7)`,
      `rgba(101, 133, 52, 0.7)`,
      `rgba(169, 107, 212, 0.7)`,
      `rgba(185, 140, 70, 0.7)`,
      `rgba(82, 88, 180, 0.7)`,
      `rgba(176, 73, 62, 0.7)`,
      `rgba(101, 127, 233, 0.7)`,
      `rgba(214, 126, 188, 0.7)`,
      `rgba(196, 86, 178, 0.7)`,
      `rgba(173, 131, 211, 0.7)`
    ],
    chart: {
      height: height
    },
    title: {
      text: `Clusters`
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function(tooltip) {
        const text = 'Loading metadata...'
        const header = `<b>Cell ID:</b> ${this.point.name} <br> <b>Cluster ID:</b> ${this.series.name} <br/>`

        tooltipContent(this.point.name)
          .then((response) => {
            const content = response.map((metadata) => {
              return `<b>${metadata.displayName}:</b> ${metadata.value}`
            })

            tooltip.label.attr({
              text: header + content.join("<br/>")
            });
          })
          .catch((reason) => {
            tooltip.label.attr({
              text: header
            });
          })

        return header + text
      }
    }
  }

  const perplexityOptions = perplexities.sort((a, b) => a - b).map((perplexity) => (
    <option key={perplexity} value={perplexity}>{perplexity}</option>
  ))

  const kOptions = ks.sort((a, b) => a - b).map((k) => (
    <option key={k} value={k}>{k}</option>
  ))

  return [
      <div key={`perplexity-k-select`} className={`row`}>
          <div className={`column medium-6`}>
              <label>t-SNE Perplexity</label>
              <select value={selectedPerplexity} onChange={ (event) => { onChangePerplexity(Number(event.target.value)) } }>
                  {perplexityOptions}
              </select>
          </div>
          <div className={`column medium-6`}>
            <label>Number of clusters, <i>k</i></label>
            <select value={selectedK} onChange={ (event) => { onChangeK(Number(event.target.value)) } }>
              {kOptions}
            </select>
          </div>
      </div>,

      <ScatterPlotLoader key={`cluster-plot`}
                         wrapperClassName={`row`}
                         chartClassName={`small-12 columns`}
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
  selectedK: PropTypes.number.isRequired,
  onChangeK: PropTypes.func.isRequired,

  perplexities: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedPerplexity: PropTypes.number.isRequired,
  onChangePerplexity: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string,

  tooltipContent: PropTypes.func
}

export {ClusterTSnePlot as default, _colourizeClusters}
