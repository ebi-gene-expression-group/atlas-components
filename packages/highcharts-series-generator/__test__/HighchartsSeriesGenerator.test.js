import HighchartsSeriesGenerator from '../src/HighchartsSeriesGenerator'

describe (`HighchartsSeriesGenerator`, () => {
  const seriesNames = [`Series 1`, `Series 2`, `Series 3`, `Series 4`, `Series 5`]
  const maxPointsPerSeries = 1000

  test(`creates the right number of series`, () => {
    const randomSeriesNames =
      seriesNames.reduce((acc, seriesName) => Math.random() > 0.5 ? acc.concat(seriesName) : acc, [])

    expect(HighchartsSeriesGenerator.generate(randomSeriesNames, maxPointsPerSeries)).toHaveLength(randomSeriesNames.length)
  })

  test(`creates series with the right format, as per Highcharts API, plus a field for gene expression`, () => {
    const randomSeriesNames =
      seriesNames.reduce((acc, seriesName) => Math.random() > 0.5 ? acc.concat(seriesName) : acc, [])

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
    const randomSeriesNames =
      seriesNames.reduce((acc, seriesName) => Math.random() > 0.5 ? acc.concat(seriesName) : acc, [])

    HighchartsSeriesGenerator.generate(randomSeriesNames, maxPointsPerSeries).forEach((series) => {
      expect(series.data.length).toBeLessThanOrEqual(maxPointsPerSeries)
    })
  })

  test(`data with the same see`, () => {
    const randomSeriesNames =
      seriesNames.reduce((acc, seriesName) => Math.random() > 0.5 ? acc.concat(seriesName) : acc, [])

    expect(HighchartsSeriesGenerator.generate(randomSeriesNames, maxPointsPerSeries)).toHaveLength(randomSeriesNames.length)
  })

  test(`series generated with the same seed match snapshot`, () => {
    const seed = `If you get killed in someone else’s dream, you die for real, Morty.`
    const series = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries, seed)
    expect(series).toMatchSnapshot()
  })

  // Jest: `.not` cannot be used with `.toMatchSnapshot()`.
  // test(`series generated without a seed don’t match snapshot`, () => {
  //   const series = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
  //   expect(series).not.toMatchSnapshot()
  // })
})
