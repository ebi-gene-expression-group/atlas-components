import Color from 'color'
import HighchartsSeriesGenerator from 'highcharts-series-generator'

import {_colourizeClusters} from '../src/ClusterTSnePlot'
import {_colourizeExpressionLevel} from '../src/GeneExpressionTSnePlot'
import '../src/util/MathRound'

const seriesNames = [`0`, `1`, `2`, `3`, `4`]
const maxPointsPerSeries = 1000

describe(`SeriesMapper.colourizeClusters`, () => {
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

describe(`SeriesMapper.colourizeExpressionLevel`, () => {

  const plotData = (series) => {
    const allPoints = series.reduce((acc, series) => acc.concat(series.data), [])

    return {
      series: series,
      min: Math.min(...allPoints.map((point) => point.expressionLevel)),
      max: Math.max(...allPoints.map((point) => point.expressionLevel))
    }
  }

  const gradientColours = [`rgb(0, 0, 115)`, `rgb(0, 85, 225)`, `rgb(128, 255, 255)`, `rgb(215, 255, 255)`]

  test(`must not change the number of series`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    expect(_colourizeExpressionLevel(gradientColours, [])(plotData(randomSeries))).toHaveLength(seriesNames.length)
  })

  test(`must not change the number of points in each series`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeExpressionLevel(gradientColours, [])(plotData(randomSeries)).forEach((series, i) => {
      expect(series.data).toHaveLength(randomSeries[i].data.length)
    })
  })

  test(`adds a color field to all points`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    _colourizeExpressionLevel(gradientColours, [])(plotData(randomSeries)).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).toHaveProperty(`color`)
      })
    })
  })

  test(`assigns maximum colour to the point with highest expression`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const maxExpressionLevel = Math.round10(Math.max(...allPoints.map((point) => point.expressionLevel)), -2)

    const maxExpressionLevelPoints = _colourizeExpressionLevel(gradientColours, [])(plotData(randomSeries)).reduce((acc, series) => {
      acc.push(series.data.filter((point) => point.expressionLevel === maxExpressionLevel, -2))
      return acc
    }, [])
    .reduce((acc, points) => points.length ? acc.concat(points) : acc, [])

    expect(maxExpressionLevelPoints.length).toBeGreaterThanOrEqual(1)
    maxExpressionLevelPoints.forEach((point) => {
      expect(point).toHaveProperty(`color`, Color(gradientColours[0]).alpha(0.65).rgb().toString())
    })
  })

  test(`assigns minimum colour to the point with lowest expression`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const minExpressionLevel = Math.round10(Math.min(...allPoints.map((point) => point.expressionLevel)), -2)

    const minExpressionLevelPoints = _colourizeExpressionLevel(gradientColours, [])(plotData(randomSeries)).reduce((acc, series) => {
      acc.push(series.data.filter((point) => point.expressionLevel === minExpressionLevel, -2))
      return acc
    }, [])
    .reduce((acc, points) => points.length ? acc.concat(points) : acc, [])

    expect(minExpressionLevelPoints.length).toBeGreaterThanOrEqual(1)
    minExpressionLevelPoints.forEach((point) => {
      expect(point).toHaveProperty(`color`, Color(gradientColours[gradientColours.length - 1]).alpha(0.65).rgb().toString())
    })
  })

  test(`rounds expression level to two decimal places`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    _colourizeExpressionLevel(gradientColours, [])(plotData(randomSeries)).forEach((series) => {
      series.data.forEach((point) => {
          if (String(point.expressionLevel).includes(`.`)) {
            expect(String(point.expressionLevel).split(`.`)[1].length).toBeLessThanOrEqual(2)
          }
        })
    })
  })

  test(`assigns default colour, i.e. blue, if all points have the same expression level`, () => {
    _colourizeExpressionLevel(gradientColours, [])({
      series: [
        {
          name: `Cluster 1`,
          data: [
            {
              name: `Point 1-1`,
              x: 1,
              y: 1,
              expressionLevel: 100.0
            }
          ]
        },
        {
          name: `Cluster 2`,
          data: [
            {
              name: `Point 2-1`,
              x: 2,
              y: 2,
              expressionLevel: 100.0
            },
            {
              name: `Point 2-2`,
              x: 3,
              y: 3,
              expressionLevel: 100.0
            }
          ]
        }
      ],
      min: 100.0,
      max: 100.0
    }).forEach((series) => {
      series.data.forEach((point) => {
          expect(point).toHaveProperty(`color`, Color(`blue`).alpha(0.65).rgb().toString())
        })
    })
  })
})
