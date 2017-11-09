import Color from 'color'
import HighchartsSeriesGenerator from 'highcharts-series-generator'

import {_colourizeClusters} from '../src/ClusterTSnePlot'
import '../src/util/MathRound'

const seriesNames = [`0`, `1`, `2`, `3`, `4`]
const maxPointsPerSeries = 1000

describe(`ClusterTSnePlot colourize function`, () => {
  test(`must not change the number of series`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    expect(_colourizeClusters([], `lightgrey`)(randomSeries)).toHaveLength(seriesNames.length)
  })

  test(`must not change the number of points in each series`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series, i) => {
      expect(series.data).toHaveLength(randomSeries[i].data.length)
    })
  })

  test(`must not dim (i.e. add a color field) any series if all are highlighted`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeClusters(seriesNames, `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).not.toHaveProperty(`color`)
      })
    })
  })

  test(`must not dim (i.e. add a color field) any series if none are passed to highlight`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).not.toHaveProperty(`color`)
      })
    })
  })

  test(`dims all series but the highlighted ones`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    // Make sure that we’re not testing the test above by highlighting at least one cluster
    let highlightRandomSeries = []
    while (highlightRandomSeries.length === 0) {
      highlightRandomSeries =
        seriesNames.reduce((acc, seriesName) =>  Math.random() > 0.5 ? acc.concat(seriesName) : acc, [])
    }

    _colourizeClusters(highlightRandomSeries, `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        if (highlightRandomSeries.includes(series.name)) {
          expect(point).not.toHaveProperty(`color`)
        } else {
          expect(point).toHaveProperty(`color`, Color(`lightgrey`).alpha(0.65).rgb().toString())
        }
      })
    })
  })
})
