import HighchartsSeriesGenerator from '../src/HighchartsSeriesGenerator'

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// const getRandomInt = (min, max) => {
//   min = Math.ceil(min)
//   max = Math.floor(max)
//   return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
// }

describe (`HighchartsSeriesGenerator`, () => {
  const seriesNames = [`Series 1`, `Series 2`, `Series 3`, `Series 4`, `Series 5`]
  const maxPointsPerSeries = 1000

  test(`creates the right number of series`, () => {
    const randomSeriesNames = seriesNames.filter(() => Math.random() < 0.5)

    expect(HighchartsSeriesGenerator.generate(randomSeriesNames, maxPointsPerSeries))
      .toHaveLength(randomSeriesNames.length)
  })

  test(`creates series with the right format, as per Highcharts API, plus a field for gene expression`, () => {
    const randomSeriesNames = seriesNames.filter(() => Math.random() < 0.5)

    HighchartsSeriesGenerator.generate(randomSeriesNames, maxPointsPerSeries).forEach((series) => {
      expect(series).toHaveProperty(`name`)
      expect(series).toHaveProperty(`data`)
      series.data.forEach((point) => {
        expect(point).toHaveProperty(`x`)
        expect(point).toHaveProperty(`y`)
        expect(point).toHaveProperty(`name`)
        expect(point).toHaveProperty(`expressionLevel`)
      })
    })
  })

  test(`data points are bounded by parameter`, () => {
    const randomSeriesNames = seriesNames.filter(() => Math.random() < 0.5)

    HighchartsSeriesGenerator.generate(randomSeriesNames, maxPointsPerSeries)
      .forEach((series) => {
        expect(series.data.length).toBeLessThanOrEqual(maxPointsPerSeries)
      })
  })

  test(`data with the same seed match, and not otherwise`, () => {
    const seed = `If you get killed in someone else’s dream, you die for real, Morty.`

    expect(HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries, seed))
      .toEqual(HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries, seed))

    expect(HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries, seed))
      .not.toEqual(HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries))

    expect(HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries))
      .not.toEqual(HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries))
  })
})
