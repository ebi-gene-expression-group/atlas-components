import React from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting'
import HighchartsColorAxis from 'highcharts/modules/coloraxis'
import HighchartsBoost from 'highcharts/modules/boost'

//import HighchartsMap from 'highcharts/modules/map'
//import highchartsYAxisPanningModule from './modules/y-axis-panning'

import highchartsExportStyle from './modules/export-style'
import highchartsAdaptChartToLegendModule from './modules/adapt-chart-to-legend'
import highchartsColorAxisLogWithNegativeValues from './modules/coloraxis-logarithmic-with-negative-values'


import deepmerge from 'deepmerge'
import SeriesPropTypes from './SeriesPropTypes'

Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => [
  // Arrow stem
  `M`, x + w * 0.5, y,
  `L`, x + w * 0.5, y + h * 0.7,
  // Arrow head
  `M`, x + w * 0.3, y + h * 0.5,
  `L`, x + w * 0.5, y + h * 0.7,
  `L`, x + w * 0.7, y + h * 0.5,
  // Box
  `M`, x, y + h * 0.9,
  `L`, x, y + h,
  `L`, x + w, y + h,
  `L`, x + w, y + h * 0.9
]

async function addModules() {
  // Only include modules if Highcharts isn’t a *good* mock -- Boost/Exporting can break tests
  // if (Highcharts.getOptions()) {...}
  HighchartsExporting(Highcharts)
  HighchartsOfflineExporting(Highcharts)
  highchartsExportStyle(Highcharts)

  HighchartsColorAxis(Highcharts)
  highchartsColorAxisLogWithNegativeValues(Highcharts)

  highchartsAdaptChartToLegendModule(Highcharts)

  // Boost should be the last module loaded; read note in https://www.highcharts.com/docs/advanced-chart-features/boost-module
  HighchartsBoost(Highcharts)
}

addModules()

// To add drag-to-pan functionality:
// HighchartsMap(Highcharts)
// highchartsYAxisPanningModule(Highcharts)

const getRadiusSize = (totalNumberOfPoints) => {
  if (totalNumberOfPoints >= 40000) {
    return 1.25
  } else if (totalNumberOfPoints >= 10000) {
    return 2
  } else if (totalNumberOfPoints >= 5000) {
    return 3
  }
  return 4
}

const highchartsBaseConfig = {
  credits: {
    enabled: false
  },
  tooltip: {
    outside: true
  },

  chart: {
    type: `scatter`,
    height: `100%`,
    panning: true,
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
        text: `Download`,
        symbol: `download`,
        menuItems: [`downloadPNG`, `downloadJPEG`, `downloadPDF`, `downloadSVG`]
      }
    }
  }
}

const ScatterPlot = (props) => {
  const { chartClassName, series, highchartsConfig } = props
  const boostThreshold = 10000
  const totalNumberOfPoints = series.reduce((acc, cur) => acc + cur.data.length, 0)

  const config =
    deepmerge.all([
      highchartsBaseConfig,
      {
        boost: {
          useGPUTranslations: true,
          usePreAllocated: true,
          seriesThreshold: totalNumberOfPoints >= boostThreshold ? 1 : null
        }
      },
      {
        plotOptions: {
          series: {
            states: {
              inactive: {
                enabled: false
              }
            },
            boostThreshold: boostThreshold,
            marker: {
              radius: getRadiusSize(totalNumberOfPoints)
            },
            stickyTracking: false
          }
        }
      },
      {
        series: series
      },
      highchartsConfig
    ], {
      arrayMerge: (destination, source) => source // Don’t merge, overwrite instead
    })

  return (
    <div className={chartClassName}>
      <HighchartsReact
        highcharts={Highcharts}
        options={config}
        callback={props.afterRender} />
    </div>
  )
}

ScatterPlot.propTypes = {
  chartClassName: PropTypes.string,
  series: SeriesPropTypes,
  highchartsConfig: PropTypes.object,
  legendWidth: PropTypes.number,
  afterRender: PropTypes.func.isRequired
}

ScatterPlot.defaultProps = {
  highchartsConfig: {}
}

export default ScatterPlot
