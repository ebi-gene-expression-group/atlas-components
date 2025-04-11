import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'
import {find as _find, flatten as _flatten} from 'lodash'

import ScatterPlotLoader from './plotloader/PlotLoader'
import PlotSettingsDropdown from './PlotSettingsDropdown'


const _colourizeClusters = (highlightSeries) => (series) => {
  const isHighlighted = (name) =>
      !highlightSeries.length ||
      highlightSeries.length === series.length ||
      highlightSeries.map((hs) => `Cluster ${hs}`).includes(name)

  const toPointObject = ([x, y, name]) => ({ x, y, name })

  return series.map((aSeries) => {
    const base = {
      name: aSeries.name,
      data: aSeries.data.map(toPointObject),
    }

    if (isHighlighted(aSeries.name)) {
      if (aSeries.name === 'Not available') {
        return {
          ...base,
          zIndex: -1,
          color: Color('lightgrey').alpha(0.65).rgb().toString(),
        }
      }
      return base
    }

    return {
      ...base,
      color: Color('lightgrey').alpha(0.65).rgb().toString(),
    }
  })
}


const tooltipHeader = (clusterType, series, point) => {
  const clusterName = clusterType === `clusters` ?
    `<b>Cluster name:</b> ${series.name}<br>` : ``
  return `<b>Cell ID:</b> ${point.name}<br>` + clusterName
}

const ClusterTSnePlot = (props) => {
  const {ks, metadata, selectedColourBy, onChangeColourBy, clusterType} = props  // Select
  const {plotData, highlightClusters, height, tooltipContent} = props   // Chart
  const {loading, resourcesUrl, errorMessage} = props   // Overlay

  const opacity = 0.7

  const highchartsConfig = {
    plotOptions: {
      series: {
        turboThreshold: 0, // disables turbo so name stays intact
        boostThreshold: 0
      },
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

  const kOptions = ks.length > 0 ? ks.sort((a, b) => a - b).map((k) => ({
    value: k.toString(),
    label: `k = ${k}`,
    group: `clusters`
  })) : null

  const metadataOptions = metadata.map((metadata) => ({
    ...metadata,
    group: `metadata`
  }))

  const options = [
    {
      label: `Metadata`,
      options: metadataOptions,
    }
  ]

  if (kOptions) {
    options[1] = {
      label: `Number of clusters`,
      options: kOptions,
    }
  }

  const defaultValue = _find(
      _flatten(
          options.map((item) => (item.options))
      ),
      {value: selectedColourBy}
  )

  const afterRender = (chart) => {
    chart.series.forEach(series => {
      if (series.legendSymbol) {
        const legendSymbolSize = 10
        series.legendSymbol.translate(
            (series.legendSymbol.width / 2) - legendSymbolSize / 2,
            (series.legendSymbol.height / 2) - legendSymbolSize / 2)
        series.legendSymbol.attr(`width`, legendSymbolSize)
        series.legendSymbol.attr(`height`, legendSymbolSize)
      }
    })
  }

  return (
      <React.Fragment>
        <div key={`perplexity-k-select`} className={`row`}>
          <PlotSettingsDropdown
              labelText={`Colour plot by:`}
              options={metadata ? options : kOptions} // Some experiments don't have metadata in Solr, although they should do. Leaving this check in for now so we don't break the entire experiment page.
              defaultValue={defaultValue}
              onSelect={(selectedOption) => {
                onChangeColourBy(selectedOption.group, selectedOption.value)
              }}/>
        </div>
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
      </React.Fragment>
  )
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

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string,

  tooltipContent: PropTypes.func
}

export {ClusterTSnePlot as default, _colourizeClusters, tooltipHeader}
