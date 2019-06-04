import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'

import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsBoost from 'highcharts/modules/boost'
import HighchartsHeatmap from 'highcharts/modules/heatmap'
//import HighchartsMap from 'highcharts/modules/map'
//import highchartsYAxisPanningModule from './highchartsYAxisPanningModule'

import HighchartsExportStyle from './highchartsExportStyle'
import highchartsHeatmapLegendModule from './highchartsHeatmapLegendModule'
import highchartsAdaptChartToLegendModule from 'highcharts-adapt-chart-to-legend'

import deepmerge from 'deepmerge'
import SeriesPropTypes from './SeriesPropTypes'

const Highcharts = ReactHighcharts.Highcharts
// Only apply modules if Highcharts isn’t a *good* mock -- Boost/Exporting can break tests
// if (Highcharts.getOptions()) {
async function addModules(){
  await HighchartsExporting(Highcharts)
  await HighchartsBoost(Highcharts)
  await HighchartsHeatmap(Highcharts)
  await highchartsHeatmapLegendModule(Highcharts)
  await highchartsAdaptChartToLegendModule(Highcharts)
  await HighchartsExportStyle(Highcharts)

  //await HighchartsMap(Highcharts)
  //await highchartsYAxisPanningModule(Highcharts)
}

addModules()

const highchartsBaseConfig = {
  credits: {
    enabled: false
  },

  chart: {
    type: `scatter`,
    spacingLeft: 0,
    height: `100%`,
    panning: true,
    spacingTop: 50,
    zoomType: `xy`,
    plotBackgroundColor: `transparent`, // This needs to be set to allow access to this.plotBackground
    events: {
      load: function() { this.plotBackground.htmlCss({ cursor: `crosshair` }) }
    }
  },

  legend: {
    adjustChartSize: true,
    navigation: {
      enabled: false
    }
  },

  // mapNavigation: {
  //   enabled: true,
  //   enableMouseWheelZoom: false,
  //   buttonOptions: {
  //     theme: {
  //       fill: `white`,
  //       'stroke-width': 1,
  //       stroke: `silver`,
  //       r: 0,
  //       states: {
  //           hover: {
  //               fill: `#a4edba`
  //           },
  //           select: {
  //               stroke: `#039`,
  //               fill: `#a4edba`
  //           }
  //       }
  //     },
  //     verticalAlign: `bottom`
  //   }
  // },
  boost: {
    useGPUTranslations: true,
    usePreAllocated: true,
    seriesThreshold: 5000
  },
  title: {
    text: null,
    style: {
      fontSize: `25px`,
      fontWeight: `bold`
    }
  },
  xAxis: {
    lineColor: `#e6e6e6`,
    title: {
      text: null
    },
    labels: {
      enabled: false
    },
    tickWidth: 0
  },
  yAxis: {
    lineColor: `#e6e6e6`,
    title: {
      text: null
    },
    labels: {
      enabled: false
    },
    gridLineWidth: 0,
    lineWidth: 1,
    endOnTick: false,
    startOnTick: false
  },
  colors: [`#b25fbc`, `#76b341`, `#6882cf`, `#ce9b44`, `#c8577b`, `#4fae84`, `#c95c3f`, `#7c7f39`],
  plotOptions: {
    series: {
      turboThreshold: 0,
      animation: false
    }
  },

  navigation: {
    buttonOptions: {
      theme: {
        style: {
          fontSize: `15px`
        },
        states: {
          select: {
            style: {
              fontWeight: `normal`,
              color: `black`
            }
          }
        }
      }
    },
    menuItemStyle: {
      fontSize: `15px`
    }
  },

  exporting: {
    buttons: {
      contextButton: {
        text: `<i class="icon icon-functional" data-icon="="></i>&nbsp;Download`,
        symbol: null
      }
    }
  }
}

const ScatterPlot = (props) => {
  const {chartClassName, series, highchartsConfig, legendWidth} = props

  const config =
    deepmerge.all([
      highchartsBaseConfig,
      {
        plotOptions: {
          series: {
            marker: {radius: 3},
            stickyTracking: false
          }
        }
      },
      {series: series},
      highchartsConfig,
      {
        legend: {symbolWidth: legendWidth}
      }
    ], {arrayMerge: (destination, source) => source}) // Don’t merge
  return (
    <div key={`chart`} className={chartClassName}>
      <ReactHighcharts config={config}/>
    </div>
  )
}

ScatterPlot.propTypes = {
  chartClassName: PropTypes.string,
  series: SeriesPropTypes,
  highchartsConfig: PropTypes.object,
  legendWidth: PropTypes.number
}

ScatterPlot.defaultProps = {
  highchartsConfig: {}
}

export default ScatterPlot
