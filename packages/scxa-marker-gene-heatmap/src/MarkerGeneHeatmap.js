import React from 'react'
import PropTypes from 'prop-types'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsHeatmap from 'highcharts/modules/heatmap'
import HighchartsNoData from 'highcharts/modules/no-data-to-display'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsExportData from 'highcharts/modules/export-data'

import _ from 'lodash'

// initialise modules
async function addModules() {
  HighchartsHeatmap(Highcharts)
  HighchartsNoData(Highcharts)
  HighchartsExporting(Highcharts)
  HighchartsExportData(Highcharts)
}

addModules()

const MarkerGeneHeatmap = (props) => {
  const { chartHeight, hasDynamicHeight, heatmapRowHeight } = props
  const { data, isDataFiltered, xAxisCategories, yAxisCategories } = props
  const totalNumberOfRows = Object.keys(_.groupBy(data, `geneName`)).length
  const groupedData = _.groupBy(data, `clusterIdWhereMarker`)

  const plotLines = []
  const clusterIds = Object.keys(groupedData)

  // 175px = title + legend + X axis labels; 8 is the height of a plot line separating the clusters
  const dynamicHeight = (totalNumberOfRows * heatmapRowHeight) + (clusterIds.length * 8) + 175

  // We don't need to worry about plotlines and labels if the heatmap is showing data filtered by cluster ID
  if (!isDataFiltered) {
    let plotLineAxisPosition = -0.5

    // If we don't have a set row height, we try to estimate the height as worked out by Highcharts
    let rowHeight = hasDynamicHeight ?
      heatmapRowHeight :
      Math.round((chartHeight - 175) / totalNumberOfRows + ((clusterIds.length-1) * 8))

    clusterIds.forEach((clusterId, idx, array) => {
      let numberOfRows = Object.keys(_.groupBy(groupedData[clusterId], `y`)).length // how many marker genes per cluster

      plotLineAxisPosition = plotLineAxisPosition + numberOfRows

      const yOffset = -numberOfRows * rowHeight/2

      let color, zIndex
      // don't show last plot line
      if (idx === array.length-1) {
        // removing the plot line altogether would remove the label, so we need to make it "invisible"
        color = `#FFFFFF`
        zIndex = 0
      }
      else {
        color = `#000000`
        zIndex = 5
      }

      plotLines.push({
        color: color,
        width: 2,
        value: plotLineAxisPosition,
        zIndex: zIndex,
        label: {
          text: `Cluster ${clusterId}`,
          align: `right`,
          textAlign: `left`,
          x: 15,
          y: yOffset,
          style: {
            fontWeight: `bold`,
            fontSize: `12px`
          }
        }
      })
    })
  }

  const options = {
    chart: {
      type: `heatmap`,
      height: hasDynamicHeight ? dynamicHeight : chartHeight,
      zoomType: `y`,
      animation: false,
      marginRight: data.length !== 0 ? 100 : 0,
      plotBackgroundColor: `#eaeaea`,
      spacingBottom: 0
    },
    lang: {
      noData: `There are no marker genes for this k value. Try selecting another k.`,
    },
    noData: {
      style: {
        fontWeight: `bold`,
        fontSize: `16px`,
        color: `#000000`
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: `Marker genes`,
      style: {
        fontSize: `25px`,
        fontWeight: `bold`
      }
    },
    subtitle: {
      text: `Showing top 5 marker genes per cluster (sorted by p-value)`
    },
    xAxis: {
      opposite: true,
      categories: xAxisCategories,
      labels: {
        useHtml: true,
        formatter: function () {
          if (isDataFiltered && this.value === data[0].clusterIdWhereMarker) {
            return `<span style="font-size: 12px; font-weight: bold; color: #e96b23;">Cluster ${this.value}</span>`
          }
          else {
            return `Cluster ${this.value}`
          }
        }
      },
      endOnTick: false,
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      min: 0,
      max: xAxisCategories.length-1,
      showEmpty: false,
      visible: data.length !== 0
    },

    yAxis: [{
      categories: yAxisCategories,
      title: {
        text: `Gene ID`,
        style: {
          fontWeight: `bold`
        }
      },
      reversed: true,
      startOnTick: false,
      endOnTick: false,
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      plotLines: plotLines,
      showEmpty: false,
      visible: data.length !== 0
    },
    ],

    tooltip: {
      // followPointer: true,
      formatter: function () {
        if(this.point.value === null) {
          return `<b>Cluster ID:</b> ${this.point.x+1} <br/>
                <b>Gene ID:</b> ${this.point.geneName} <br/>
                <b>Median expression:</b> Not expressed <br/>`
        }
        else {
          const text = `<b>Cluster ID:</b> ${this.point.x+1} <br/> 
                  <b>Cluster ID where marker:</b> ${this.point.clusterIdWhereMarker} <br/>
                  <b>Gene ID:</b> ${this.point.geneName} <br/>
                  <b>Median expression:</b> ${+this.point.value.toFixed(3)} TPM`

          if(this.point.clusterIdWhereMarker === this.point.x+1) {
            return text + `<br/><b>P-value:</b> ${this.point.pValue.toExponential(3)}`
          }
          else {
            return text
          }
        }
      }
    },

    colorAxis: {
      type: `logarithmic`,
      min: 0.1,
      max: 100000,
      stops: [
        [0, `#ffffff`],
        [0.67, `#6077bf`],
        [1, `#0e0573`]
      ],
      marker: {
        color: `#e96b23`
      },
    },

    legend: {
      title: {
        text: `Median expression (TPM)`
      },
      align: `center`,
      verticalAlign: `top`,
      layout: `horizontal`,
      symbolWidth: 480,
      enabled: data.length !== 0
    },

    series: [{
      data: data,
      nullColor: `#eaeaea`,
      cursor: `crosshair`,
      states: {
        hover: {
          brightness: 0,
          borderWidth: 2,
          borderColor: `#e96b23`
        }
      },
      turboThreshold: 0
    }],

    boost: {
      useGPUTranslations: true
    }
  }

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

MarkerGeneHeatmap.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    geneName: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    clusterIdWhereMarker: PropTypes.number.isRequired,
    pValue: PropTypes.number
  })).isRequired,
  isDataFiltered: PropTypes.bool.isRequired,
  xAxisCategories: PropTypes.array.isRequired,
  yAxisCategories: PropTypes.array.isRequired,
  hasDynamicHeight: PropTypes.bool.isRequired,
  heatmapRowHeight: PropTypes.number.isRequired
}

export default MarkerGeneHeatmap
