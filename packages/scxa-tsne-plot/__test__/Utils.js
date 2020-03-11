import HighchartsSeriesGenerator from '@ebi-gene-expression-group/highcharts-series-generator'

const seriesNames = [`0`, `1`, `2`, `3`, `4`]
const maxPointsPerSeries = 1000

const gradientColourRanges = () => {
  return [
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
}

const plotData = (series) => {
  const allPoints = series.reduce((acc, series) => acc.concat(series.data), [])

  return {
    series: series,
    min: Math.min(...allPoints.map((point) => point.expressionLevel)),
    max: Math.max(...allPoints.map((point) => point.expressionLevel)),
    unit: `TPM`
  }
}

const randomHighchartsSeries = () => {
  return HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
}

const randomHighchartsSeriesWithNamesAndMaxPoints = (seriesNames, maxPointsPerSeries) => {
  return HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries)
}

const randomHighchartsSeriesWithSeed = () => {
  const seed = `A hair, Morty. I need one of your hairs. This isn’t Game of Thrones.`

  return HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries, seed)
}

export { plotData, gradientColourRanges, randomHighchartsSeries, randomHighchartsSeriesWithSeed, randomHighchartsSeriesWithNamesAndMaxPoints}
