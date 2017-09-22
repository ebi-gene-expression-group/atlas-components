import RandomSeriesGenerator from './RandomSeriesGenerator'

describe (`RandomSeriesGenerator`, () => {
  const seriesNames = [`1`, `2`, `3`, `4`, `5`]
  const maxPointsPerSeries = 1000

  test(`creates the right number of series`, () => {
    expect(RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries)).toHaveLength(seriesNames.length)
  })

  test(`creates series with the right format, as per Highcharts API`, () => {
    RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries).forEach((series) => {
      expect(series).toHaveProperty(`name`)
      expect(series).toHaveProperty(`data`)
    })
  })

  test(`data points are bounded by parameter`, () => {
    RandomSeriesGenerator.generate(seriesNames, maxPointsPerSeries).forEach((series) => {
      expect(series.data.length).toBeLessThanOrEqual(maxPointsPerSeries)
    })
  })
})
