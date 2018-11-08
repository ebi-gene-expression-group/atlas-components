import React from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_heatmap from 'highcharts/modules/heatmap'
import _ from 'lodash'

// init the module
HC_heatmap(Highcharts)

const MarkerGeneHeatmap = (props) => {
  const {chartHeight, data} = props

  const yAxisCategories = _.uniq(data.map(x => x.name))
  const secondaryYAxisCategories = _.uniqBy(data, `name`).map(x => x.clusterIdWhereMarker)

  const options = {
    chart: {
      type: `heatmap`,
      height: chartHeight,
      zoomType: `y`,
      animation: false
      // plotBackgroundColor: `#D3D3D3`
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
      text: `Showing top 50 marker genes per cluster (sorted by p-value)`
    },
    xAxis: {
      opposite: true,
      labels: {
        format: `Cluster {value}`
      },
      endOnTick: false,
      gridLineWidth: 0,
      minorGridLineWidth: 0
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
      minorGridLineWidth: 0
    },
    {
      linkedTo: 0,
      categories: secondaryYAxisCategories,
      opposite: true,
      reversed: true,
      title: {
        text: `Cluster ID where marker`,
        style: {
          fontWeight: `bold`
        }
      },
      labels: {
        format: `Cluster {value}`
      },
      startOnTick: false,
      endOnTick: false,
      gridLineWidth: 0,
      minorGridLineWidth: 0
    }],

    tooltip: {
      formatter: function () {
        if(this.point.value === null) {
          return `<b>Cluster ID:</b> ${this.point.x} <br/> <b>Gene ID:</b> ${this.point.name} <br /> <b>Median expression:</b> Not expressed <br/>`
        }
        else {
          return `<b>Cluster ID:</b> ${this.point.x} <br/> <b>Gene ID:</b> ${this.point.name} <br /> <b>Median expression:</b> ${+this.point.value.toFixed(3)} TPM <br/>`
        }
      }
    },

    colorAxis: {
      type: `logarithmic`,
      minColor: `#d7ffff`,
      maxColor: `#024990`,
      stops: [
        [0, `#d4e4fb`],
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
      nullColor: `#D3D3D3`,
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
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}

MarkerGeneHeatmap.propTypes = {
  chartHeight: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    name: PropTypes.string,
    value: PropTypes.number
  }))
}

export default MarkerGeneHeatmap
