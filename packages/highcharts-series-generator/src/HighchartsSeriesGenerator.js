import seedrandom from 'seedrandom'

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const generateRandomSeriesData = (pointsCount) => {
  const seriesData = []
  for (let i = 0 ; i < pointsCount ; i++) {
    seriesData.push([
      getRandomArbitrary(0, 100), // x
      getRandomArbitrary(0, 100), // y
      String(`cell_${i}`), //name
      getRandomArbitrary(0, 10000), //expressionLevel
    ])
  }

  return seriesData
}

const generateRandomSeries = (seriesNames, maxPointsPerSeries, seed) => {
  seedrandom(seed, { global: true })

  return seriesNames.map((seriesName) => ({
    name: seriesName,
    data: generateRandomSeriesData(getRandomInt(0, maxPointsPerSeries))
  }))
}

const HighchartsSeriesGenerator = {
  generate: generateRandomSeries
}

export default HighchartsSeriesGenerator
