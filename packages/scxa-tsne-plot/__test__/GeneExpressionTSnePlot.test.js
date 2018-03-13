import React from 'react'
import renderer from 'react-test-renderer'
import Color from 'color'

import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {_colourizeExpressionLevel} from '../src/GeneExpressionTSnePlot'
import GeneExpressionTSnePlot from '../src/GeneExpressionTSnePlot'
import MultiStopGradient from '../src/MultiStopGradient'

import '../src/util/MathRound'
import {gradientColourRanges, randomHighchartsSeries, randomHighchartsSeriesWithNamesAndMaxPoints, plotData, randomHighchartsSeriesWithSeed} from './Utils'

Enzyme.configure({ adapter: new Adapter() })

describe(`GeneExpressionTSnePlot colourize function`, () => {

  test(`must not change the number of series`, () => {
    const seriesNames = [`0`, `1`, `2`, `3`, `4`]
    const maxPointsPerSeries = 1000
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, maxPointsPerSeries)
    expect(_colourizeExpressionLevel(gradientColourRanges(), [])(plotData(randomSeries))).toHaveLength(seriesNames.length)
  })

  test(`must not change the number of points in each series`, () => {
    const randomSeries = randomHighchartsSeries()
    _colourizeExpressionLevel(gradientColourRanges(), [])(plotData(randomSeries)).forEach((series, i) => {
      expect(series.data).toHaveLength(randomSeries[i].data.length)
    })
  })

  test(`adds a color field to all points`, () => {
    const randomSeries = randomHighchartsSeries()

    _colourizeExpressionLevel(gradientColourRanges(), [])(plotData(randomSeries)).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).toHaveProperty(`color`)
      })
    })
  })

  test(`assigns maximum colour to the point with highest expression`, () => {
    const randomSeries = randomHighchartsSeries()
    randomSeries[randomSeries.length - 1].data.push({
      x: 0,
      y: 0,
      expressionLevel: 10000,
      name: "Maximum overkill"
    })

    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const maxExpressionLevel = Math.round10(Math.max(...allPoints.map((point) => point.expressionLevel)), -2)

    const maxExpressionLevelPoints = _colourizeExpressionLevel(gradientColourRanges(), [])(plotData(randomSeries)).reduce((acc, series) => {
      acc.push(series.data.filter((point) => point.expressionLevel === maxExpressionLevel, -2))
      return acc
    }, [])
    .reduce((acc, points) => points.length ? acc.concat(points) : acc, [])

    expect(maxExpressionLevelPoints.length).toBeGreaterThanOrEqual(1)
    maxExpressionLevelPoints.forEach((point) => {
      expect(point).toHaveProperty(`color`, Color(gradientColourRanges()[gradientColourRanges().length - 1].colour).alpha(0.65).rgb().toString())
    })
  })

  test(`assigns grey colour to the point with 0 expression`, () => {
    const randomSeries = randomHighchartsSeries()
    randomSeries[randomSeries.length - 1].data.push({
      x: 0,
      y: 0,
      expressionLevel: 0,
      name: "Minimum underkill"
    })

    const allPoints = randomSeries.reduce((acc, series) => acc.concat(series.data), [])
    const minExpressionLevel = Math.round10(Math.min(...allPoints.map((point) => point.expressionLevel)), -2)

    const minExpressionLevelPoints = _colourizeExpressionLevel(gradientColourRanges(), [])(plotData(randomSeries)).reduce((acc, series) => {
      acc.push(series.data.filter((point) => point.expressionLevel === minExpressionLevel, -2))
      return acc
    }, [])
    .reduce((acc, points) => points.length ? acc.concat(points) : acc, [])

    expect(minExpressionLevelPoints.length).toBeGreaterThanOrEqual(1)
    minExpressionLevelPoints.forEach((point) => {
      expect(point).toHaveProperty(`color`, Color('lightgrey').alpha(0.65).rgb().toString())
    })
  })

  test(`rounds expression level to two decimal places`, () => {
    const randomSeries = randomHighchartsSeries()

    _colourizeExpressionLevel(gradientColourRanges(), [])(plotData(randomSeries)).forEach((series) => {
      series.data.forEach((point) => {
          if (String(point.expressionLevel).includes(`.`)) {
            expect(String(point.expressionLevel).split(`.`)[1].length).toBeLessThanOrEqual(2)
          }
        })
    })
  })

  test(`assigns default colour, i.e. blue, if points have no expression level property`, () => {
    _colourizeExpressionLevel(gradientColourRanges(), [])({
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

describe(`GeneExpressionTSnePlot`, () => {
  test(`with random data matches snapshot`, () => {
    const randomSeries = randomHighchartsSeriesWithSeed()
    const onSelectGeneId = () => {}

    const tree = renderer
      .create(<GeneExpressionTSnePlot height={600} expressionGradientColours={gradientColourRanges()} atlasUrl={``} suggesterEndpoint={``} onSelectGeneId={onSelectGeneId} loading={true} plotData={plotData(randomSeries)} highlightClusters={[]}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test(`contains MultiStopGradient component when min and max values exist`, () => {
    const randomSeries = randomHighchartsSeriesWithSeed()
    const onSelectGeneId = () => {}

    const wrapper = mount(<GeneExpressionTSnePlot height={600} expressionGradientColours={gradientColourRanges()} atlasUrl={``} suggesterEndpoint={``} onSelectGeneId={onSelectGeneId} loading={true} plotData={plotData(randomSeries)} highlightClusters={[]}/>)

    expect(wrapper.find(MultiStopGradient).length).toBe(1)
  })
})
