import Color from 'color'
import HighchartsSeriesGenerator from 'highcharts-series-generator'

import {_colourizeExpressionLevel} from '../src/GeneExpressionTSnePlot'
import '../src/util/MathRound'

const seriesNames = [`0`, `1`, `2`, `3`, `4`]
const maxPointsPerSeries = 1000

describe(`GeneExpressionTSnePlot colourize function`, () => {

  const plotData = (series) => {
    const allPoints = series.reduce((acc, series) => acc.concat(series.data), [])

    return {
      series: series,
      min: Math.min(...allPoints.map((point) => point.expressionLevel)),
      max: Math.max(...allPoints.map((point) => point.expressionLevel))
    }
  }

  const expressionLevelGradientRanges = [
    {
      colour: `rgb(215, 255, 255)`,
      threshold: 0,
      stopPosition: 0
    },
    {
      colour: `rgb(128, 255, 255)`,
      threshold: 10,
      stopPosition: 20
    },
    {
      colour: `rgb(0, 85, 225)`,
      threshold: 100,
      stopPosition: 40
    },
    {
      colour: `rgb(0, 0, 115)`,
      threshold: 10000,
      stopPosition: 100
    }
  ]

  test(`must not change the number of series`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    expect(_colourizeExpressionLevel(expressionLevelGradientRanges, [])(plotData(randomSeries))).toHaveLength(seriesNames.length)
  })

  test(`must not change the number of points in each series`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeExpressionLevel(expressionLevelGradientRanges, [])(plotData(randomSeries)).forEach((series, i) => {
      expect(series.data).toHaveLength(randomSeries[i].data.length)
    })
  })

  test(`adds a color field to all points`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    _colourizeExpressionLevel(expressionLevelGradientRanges, [])(plotData(randomSeries)).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).toHaveProperty(`color`)
      })
    })
  })

  test(`assigns maximum colour to the point with highest expression`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    randomSeries[randomSeries.length - 1].data.push({
      x: 0,
      y: 0,
      expressionLevel: 10000,
      name: "Maximum overkill"
    })

    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const maxExpressionLevel = Math.round10(Math.max(...allPoints.map((point) => point.expressionLevel)), -2)

    const maxExpressionLevelPoints = _colourizeExpressionLevel(expressionLevelGradientRanges, [])(plotData(randomSeries)).reduce((acc, series) => {
      acc.push(series.data.filter((point) => point.expressionLevel === maxExpressionLevel, -2))
      return acc
    }, [])
    .reduce((acc, points) => points.length ? acc.concat(points) : acc, [])

    expect(maxExpressionLevelPoints.length).toBeGreaterThanOrEqual(1)
    maxExpressionLevelPoints.forEach((point) => {
      expect(point).toHaveProperty(`color`, Color(expressionLevelGradientRanges[expressionLevelGradientRanges.length - 1].colour).alpha(0.65).rgb().toString())
    })
  })

  test(`assigns minimum colour to the point with lowest expression`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    randomSeries[randomSeries.length - 1].data.push({
      x: 0,
      y: 0,
      expressionLevel: 0,
      name: "Minimum underkill"
    })

    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const minExpressionLevel = Math.round10(Math.min(...allPoints.map((point) => point.expressionLevel)), -2)

    const minExpressionLevelPoints = _colourizeExpressionLevel(expressionLevelGradientRanges, [])(plotData(randomSeries)).reduce((acc, series) => {
      acc.push(series.data.filter((point) => point.expressionLevel === minExpressionLevel, -2))
      return acc
    }, [])
    .reduce((acc, points) => points.length ? acc.concat(points) : acc, [])

    expect(minExpressionLevelPoints.length).toBeGreaterThanOrEqual(1)
    minExpressionLevelPoints.forEach((point) => {
      expect(point).toHaveProperty(`color`, Color(expressionLevelGradientRanges[0].colour).alpha(0.65).rgb().toString())
    })
  })

  test(`rounds expression level to two decimal places`, () => {
    const randomSeries = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    _colourizeExpressionLevel(expressionLevelGradientRanges, [])(plotData(randomSeries)).forEach((series) => {
      series.data.forEach((point) => {
          if (String(point.expressionLevel).includes(`.`)) {
            expect(String(point.expressionLevel).split(`.`)[1].length).toBeLessThanOrEqual(2)
          }
        })
    })
  })

  test(`assigns default colour, i.e. blue, if points have no expression level property`, () => {
    _colourizeExpressionLevel(expressionLevelGradientRanges, [])({
      series: [
        {
          name: `Cluster 1`,
          data: [
            {
              name: `Point 1-1`,
              x: 1,
              y: 1
            }
          ]
        },
        {
          name: `Cluster 2`,
          data: [
            {
              name: `Point 2-1`,
              x: 2,
              y: 2
            },
            {
              name: `Point 2-2`,
              x: 3,
              y: 3
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
