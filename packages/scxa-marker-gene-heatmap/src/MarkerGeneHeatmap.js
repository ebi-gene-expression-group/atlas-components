import React from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_heatmap from 'highcharts/modules/heatmap'
import _ from 'lodash'

// init the module
async function addModules() {
  HC_heatmap(Highcharts)
}

addModules()

const MarkerGeneHeatmap = (props) => {
  const {chartHeight, data, numberOfColumns, hasDynamicHeight, heatmapRowHeight} = props

  const xAxisCategories = Array.from(Array(numberOfColumns+1).keys()).slice(1)
  const yAxisCategories = _.uniq(data.map(x => x.name))

  const groupedData = _.groupBy(data, `clusterIdWhereMarker`)
  let plotLines = []
  let plotLineAxisPosition = -0.5

  const clusterIds = Object.keys(groupedData)

  clusterIds.forEach((clusterId, idx, array) => {
    let numberOfRows = Object.keys(_.groupBy(groupedData[clusterId], `y`)).length // how many marker genes per cluster

    plotLineAxisPosition = plotLineAxisPosition + numberOfRows
    // Magic number 5 should bring label to the centre the heatmap slice
    const yOffset = hasDynamicHeight ? -numberOfRows * heatmapRowHeight/2 + 5 : 0

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

    let plotLine = {
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
    }
    plotLines.push(plotLine)
  })

  const options = {
    chart: {
      type: `heatmap`,
      height: chartHeight,
      zoomType: `y`,
      animation: false,
      marginRight: 100,
      plotBackgroundColor: `#eaeaea`
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
        format: `Cluster {value}`
      },
      endOnTick: false,
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      max: numberOfColumns-1
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
      plotLines: plotLines
    },
    ],

    tooltip: {
      // followPointer: true,
      formatter: function () {
        if(this.point.value === null) {
          return `<b>Cluster ID:</b> ${this.point.x+1} <br/>
                <b>Gene ID:</b> ${this.point.name} <br/>
                <b>Median expression:</b> Not expressed <br/>`
        }
        else {
          const text = `<b>Cluster ID:</b> ${this.point.x+1} <br/> 
                  <b>Cluster ID where marker:</b> ${this.point.clusterIdWhereMarker} <br/>
                  <b>Gene ID:</b> ${this.point.name} <br/>
                  <b>Median expression:</b> ${+this.point.value.toFixed(3)} TPM`

          if(this.point.clusterIdWhereMarker === this.point.x+1) {
            return text + `<br/><b>P-value:</b> ${this.point.pValue}`
          }
          else {
            return text
          }
        }
      }
    },

    colorAxis: {
      type: `logarithmic`,
      stops: [
        [0, `#ffffff`],
        [0.67, `#6077bf`],
        [1, `#0e0573`]
      ],
      marker: {
        color: `#e96b23`
      }
    },

    legend: {
      title: {
        text: `Median expression (TPM)`
      },
      align: `center`,
      verticalAlign: `top`,
      layout: `horizontal`,
      symbolWidth: 480
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
      boostThreshold: 100,
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
  numberOfColumns: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    name: PropTypes.string,
    value: PropTypes.number
  })),
  hasDynamicHeight: PropTypes.bool.isRequired,
  heatmapRowHeight: PropTypes.number.isRequired
}

export default MarkerGeneHeatmap
