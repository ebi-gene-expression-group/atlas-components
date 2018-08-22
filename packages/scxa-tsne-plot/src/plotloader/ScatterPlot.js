import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsBoost from 'highcharts/modules/boost'

import deepmerge from 'deepmerge'

import SeriesPropTypes from './SeriesPropTypes'

const Highcharts = ReactHighcharts.Highcharts
// Only apply modules if Highcharts isn’t a *good* mock -- Boost/Exporting can break tests
// if (Highcharts.getOptions()) {
HighchartsExporting(Highcharts)
HighchartsBoost(Highcharts)
// }

const highchartsBaseConfig = {
  credits: {
    enabled: false
  },
  legend: {
    labelFormat: `{name}`
  },
  chart: {
    type: `scatter`,
    zoomType: `xy`,
    borderWidth: 1,
    borderColor: `dark blue`,
    height: `100%`
  },
  boost: {
    useGPUTranslations: true,
    usePreAllocated: true,
    seriesThreshold: 5000
  },
  title: {
    text: null
  },
  xAxis: {
    title: {
      text: null
    },
    labels: {
      enabled: false
    },
    tickWidth: 0
  },
  yAxis: {
    title: {
      text: null
    },
    labels: {
      enabled: false
    },
    gridLineWidth: 0,
    lineWidth: 1
  },
  colors: [`#b25fbc`, `#76b341`, `#6882cf`, `#ce9b44`, `#c8577b`, `#4fae84`, `#c95c3f`, `#7c7f39`],
  plotOptions: {
    series: {
      turboThreshold: 0,
      animation: false,
    }
  }
}

const ScatterPlot = (props) => {
  const {chartClassName, series, highchartsConfig, children} = props

  const numPoints = series.reduce((acc, aSeries) => acc + aSeries.data.length, 0)
  const config =
    deepmerge.all([
      highchartsBaseConfig,
      {
        plotOptions: {
          series: {
            marker: {
              radius: numPoints < 5000 ? 4 : 0.2
            }
          }
        }
      },
      { series: series },
      highchartsConfig
    ], { arrayMerge: (destination, source) => source }) // Don’t merge

  return [
    <div key={`chart`} className={chartClassName}>
      <ReactHighcharts config={config}/>
    </div>,

    <div key={`children`}>{children}</div>
  ]
}

ScatterPlot.propTypes = {
  chartClassName: PropTypes.string,
  series: SeriesPropTypes,
  highchartsConfig: PropTypes.object,
  children: PropTypes.object
}

ScatterPlot.defaultProps = {
  highchartsConfig: {},
  children: null
}

export default ScatterPlot
