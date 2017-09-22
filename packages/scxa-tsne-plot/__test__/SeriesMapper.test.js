import Color from 'color'
import {_colourizeClusters, _colourizeExpressionLevel} from '../src/SeriesMapper'
import RandomSeriesGenerator from './RandomSeriesGenerator'

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

  test(`must not dim (i.e. add a color field) any series if none are passed to highlight`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).not.toHaveProperty(`color`)
      })
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

  test(`dims all series but the highlighted one`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    const highlightRandomSeries =
      seriesNames.reduce((acc, seriesName) =>  Math.random() > 0.5 ? acc.concat(seriesName) : acc, [])

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

  test(`must not change the number of series`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    expect(_colourizeExpressionLevel(hue)(randomSeries)).toHaveLength(seriesNames.length)
  })

  test(`must not change the number of points in each series`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    _colourizeExpressionLevel(hue)(randomSeries).forEach((series, i) => {
      expect(series.data).toHaveLength(randomSeries[i].data.length)
    })
  })

  test(`add a color field to all points`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    _colourizeExpressionLevel(hue)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).toHaveProperty(`color`)
      })
    })
  })

  test(`point with highest expression has the maximum colour`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const maxExpressionLevel = Math.max(...allPoints.map((point) => point.expressionLevel))

    _colourizeExpressionLevel(hue)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        if (point.expressionLevel === maxExpressionLevel) {
          expect(point).toHaveProperty(`color`, Color(`hsl(${hue}, 100%, 10%)`).rgb().toString())
        }
      })
    })
  })

  test(`point with lowest expression has the minimum colour`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const minExpressionLevel = Math.min(...allPoints.map((point) => point.expressionLevel))

    _colourizeExpressionLevel(hue)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        if (point.expressionLevel === minExpressionLevel) {
          console.log(`Match min!`)
          expect(point).toHaveProperty(`color`, Color(`hsl(${hue}, 0%, 10%)`).rgb().toString())
        }
      })
    })
  })

  test(`expression level is rounded to two decimal places`, () => {
    const randomSeries = RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)

    _colourizeExpressionLevel(hue)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
          if (String(point.expressionLevel).includes(`.`)) {
            expect(String(point.expressionLevel).split(`.`)[1].length).toBeLessThanOrEqual(2)  
          }
        })
    })
  })
})
