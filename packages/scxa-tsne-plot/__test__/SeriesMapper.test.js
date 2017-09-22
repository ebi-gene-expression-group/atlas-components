import Color from 'color'
import {_colourizeClusters, _colourizeExpressionLevel} from '../src/SeriesMapper'
import RandomSeriesGenerator from './RandomSeriesGenerator'
import '../src/util/MathRound10'

const seriesNames = [`0`, `1`, `2`, `3`, `4`]
const maxPointsPerSeries = 1000

describe(`SeriesMapper.colourizeClusters`, () => {
  test(`must not change the number of series`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    expect(_colourizeClusters([], `lightgrey`)(randomSeries)).toHaveLength(seriesNames.length)
  })

  test(`must not change the number of points in each series`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series, i) => {
      expect(series.data).toHaveLength(randomSeries[i].data.length)
    })
  })


  test(`must not dim (i.e. add a color field) any series if all are highlighted`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeClusters(seriesNames, `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).not.toHaveProperty(`color`)
      })
    })
  })

  test(`must not dim (i.e. add a color field) any series if none are passed to highlight`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).not.toHaveProperty(`color`)
      })
    })
  })

  test(`dims all series but the highlighted ones`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

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
          expect(point).toHaveProperty(`color`, `lightgrey`)
        }
      })
    })
  })
})

describe(`SeriesMapper.colourizeExpressionLevel`, () => {
  const hue = 240
  const lightness = 60

  test(`must not change the number of series`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    expect(_colourizeExpressionLevel(hue, lightness)(randomSeries)).toHaveLength(seriesNames.length)
  })

  test(`must not change the number of points in each series`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeExpressionLevel(hue, lightness)(randomSeries).forEach((series, i) => {
      expect(series.data).toHaveLength(randomSeries[i].data.length)
    })
  })

  test(`add a color field to all points`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    _colourizeExpressionLevel(hue, lightness)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).toHaveProperty(`color`)
      })
    })
  })

  test(`point with highest expression has the maximum colour`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const maxExpressionLevel = Math.round10(Math.max(...allPoints.map((point) => point.expressionLevel)), -2)

    const maxExpressionLevelPoints = _colourizeExpressionLevel(hue, lightness)(randomSeries).reduce((acc, series) => {
      acc.push(series.data.filter((point) => point.expressionLevel === maxExpressionLevel, -2))
      return acc
    }, [])
    .reduce((acc, points) => points.length ? acc.concat(points) : acc, [])

    expect(maxExpressionLevelPoints.length).toBeGreaterThanOrEqual(1)
    maxExpressionLevelPoints.forEach((point) => {
      expect(point).toHaveProperty(`color`, Color(`hsl(${hue}, 100%, ${lightness}%)`).rgb().toString())
    })
  })

  test(`point with lowest expression has the minimum colour`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const minExpressionLevel = Math.round10(Math.min(...allPoints.map((point) => point.expressionLevel)), -2)

    const minExpressionLevelPoints = _colourizeExpressionLevel(hue, lightness)(randomSeries).reduce((acc, series) => {
      acc.push(series.data.filter((point) => point.expressionLevel === minExpressionLevel, -2))
      return acc
    }, [])
    .reduce((acc, points) => points.length ? acc.concat(points) : acc, [])

    expect(minExpressionLevelPoints.length).toBeGreaterThanOrEqual(1)
    minExpressionLevelPoints.forEach((point) => {
      expect(point).toHaveProperty(`color`, Color(`hsl(${hue}, 0%, ${lightness}%)`).rgb().toString())
    })
  })

  test(`expression level is rounded to two decimal places`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    _colourizeExpressionLevel(hue, lightness)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
          if (String(point.expressionLevel).includes(`.`)) {
            expect(String(point.expressionLevel).split(`.`)[1].length).toBeLessThanOrEqual(2)
          }
        })
    })
  })
})
