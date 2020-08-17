import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'
import {find as _find, flatten as _flatten} from 'lodash'

import ScatterPlotLoader from './plotloader/PlotLoader'
import PlotSettingsDropdown from './PlotSettingsDropdown'

const _colourizeClusters = (highlightSeries) =>
  (series) => series.map((aSeries) => {
    // I can’t think of a better way to reconcile series.name being a string and highlightSeries being an array of
    // numbers. For more flexibility we might think of having our series be identified by an arbitrary ID string
    if (!highlightSeries.length || highlightSeries.length === series.length || highlightSeries.map((hs) => `Cluster ${hs}`).includes(aSeries.name)) {
      if(aSeries.name === `Not available`) {
        return {
          name: aSeries.name,
          data: aSeries.data,
          color: Color(`lightgrey`).alpha(0.65).rgb().toString()
        }
      } else return aSeries

    } else {
      return {
        name: aSeries.name,
        data: aSeries.data,
        color: Color(`lightgrey`).alpha(0.65).rgb().toString()
      }
    }
  })

const tooltipHeader = (clusterType, series, point) => {
  const clusterName = clusterType === `clusters` ?
    `<b>Cluster name:</b> ${series.name}<br>` : ``
  return `<b>Cell ID:</b> ${point.name}<br>` + clusterName
}

const ClusterTSnePlot = (props) => {
  const {ks, perplexities, metadata, selectedPerplexity, onChangePerplexity, selectedColourBy, onChangeColourBy, clusterType} = props  // Select
  const {plotData, highlightClusters, height, tooltipContent} = props   // Chart
  const {loading, resourcesUrl, errorMessage, showControls} = props   // Overlay
  const opacity = 0.7

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
      `rgba(212, 137, 48, ${opacity})`,
      `rgba(71, 193, 152, ${opacity})`,
      `rgba(90, 147, 221, ${opacity})`,
      `rgba(194, 73, 97, ${opacity})`,
      `rgba(128, 177, 66, ${opacity})`,
      `rgba(208, 76, 134, ${opacity})`,
      `rgba(188, 176, 59, ${opacity})`,
      `rgba(132, 43, 102, ${opacity})`,
      `rgba(93, 188, 108, ${opacity})`,
      `rgba(82, 45, 128, ${opacity})`,
      `rgba(101, 133, 52, ${opacity})`,
      `rgba(169, 107, 212, ${opacity})`,
      `rgba(185, 140, 70, ${opacity})`,
      `rgba(82, 88, 180, ${opacity})`,
      `rgba(176, 73, 62, ${opacity})`,
      `rgba(101, 127, 233, ${opacity})`,
      `rgba(214, 126, 188, ${opacity})`,
      `rgba(196, 86, 178, ${opacity})`,
      `rgba(173, 131, 211, ${opacity})`,
      `rgba(193, 84, 47, ${opacity})`
    ],
    chart: {
      height: height
    },
    title: {
      text: `Clusters`
    },
    legend: {
      enabled: true,
      align: `center`,
      verticalAlign: `bottom`,
      layout: `horizontal`,
      itemMarginBottom: 20
    },
    tooltip: {
      formatter: function (tooltip) {
        // Trick Highcharts into thinking the point is in the bottom half of the chart, so that the tooltip
        // is displayed below the point
        this.point.negative = true
        const text = `Loading metadata...`
        const header = tooltipHeader(clusterType, this.series, this.point)
        const addMetadataToTooltipText = async () => {
          try {
            const response = await tooltipContent(this.point.name)

            const content = response.map((metadata) => {
              return `<b>${metadata.displayName}:</b> ${metadata.value}`
            })

            tooltip.label.attr({
              text: header + content.join(`<br>`)
            })
          } catch (e) {
            tooltip.label.attr({
              text: header
            })
          }
        }

        addMetadataToTooltipText()

        return header + text
      }
    }
  }

  const perplexityOptions = perplexities.sort((a, b) => a - b).map((perplexity) => ({
    value: perplexity,
    label: perplexity
  }))

  const kOptions = ks.sort((a, b) => a - b).map((k) => ({
    value: k.toString(),
    label: `k = ${k}`,
    group: `clusters`
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

  const afterRender = (chart) => {
    chart.series.forEach(series => {
      const legendSymbolSize = 10
      series.legendSymbol.translate(
        (series.legendSymbol.width / 2) - legendSymbolSize / 2,
        (series.legendSymbol.height / 2) - legendSymbolSize / 2)
      series.legendSymbol.attr(`width`, legendSymbolSize)
      series.legendSymbol.attr(`height`, legendSymbolSize)
    })
  }

  return [
    <div key={`perplexity-k-select`} className={`row`}>
      {showControls &&
      <div className={`small-12 medium-6 columns`}>
        <PlotSettingsDropdown
          labelText={`t-SNE Perplexity`}
          options={perplexityOptions}
          defaultValue={{value: selectedPerplexity, label: selectedPerplexity}}
          onSelect={(selectedOption) => {
            onChangePerplexity(selectedOption.value)
          }}/>
      </div>
      }
      <div className={`small-12 medium-6 columns`}>
        <PlotSettingsDropdown
          labelText={`Colour plot by:`}
          options={metadata ? options : kOptions} // Some experiments don't have metadata in Solr, although they should do. Leaving this check in for now so we don't break the entire experiment page.
          defaultValue={defaultValue}
          onSelect={(selectedOption) => {
            onChangeColourBy(selectedOption.group, selectedOption.value)
          }}/>
      </div>
    </div>,
    <ScatterPlotLoader
      key={`cluster-plot`}
      wrapperClassName={`row`}
      chartClassName={`small-12 columns`}
      series={_colourizeClusters(highlightClusters)(plotData.series)}
      highchartsConfig={highchartsConfig}
      loading={loading}
      resourcesUrl={resourcesUrl}
      errorMessage={errorMessage}
      afterRender={afterRender}
    />
  ]
}

ClusterTSnePlot.propTypes = {
  height: PropTypes.number.isRequired,
  showControls: PropTypes.bool.isRequired,

  plotData: PropTypes.shape({
    series: PropTypes.array.isRequired
  }),
  highlightClusters: PropTypes.array,

  ks: PropTypes.arrayOf(PropTypes.number).isRequired,
  metadata: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })),
  selectedColourBy: PropTypes.string,
  onChangeColourBy: PropTypes.func,
  clusterType: PropTypes.string,

  perplexities: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedPerplexity: PropTypes.number.isRequired,
  onChangePerplexity: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string,

  tooltipContent: PropTypes.func
}

export {ClusterTSnePlot as default, _colourizeClusters, tooltipHeader}
