import React from 'react'
import renderer from 'react-test-renderer'
import Color from 'color'

import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {_colourizeClusters} from '../src/ClusterTSnePlot'
import ClusterTSnePlot from '../src/ClusterTSnePlot'
import ScatterPlotLoader from '../src/plotloader/PlotLoader'

import '../src/util/MathRound'
import {randomHighchartsSeriesWithNamesAndMaxPoints} from './Utils'

Enzyme.configure({ adapter: new Adapter() })

const seriesNames = [`0`, `1`, `2`, `3`, `4`]
const maxPointsPerSeries = 1000

describe(`ClusterTSnePlot colourize function`, () => {
  test(`must not change the number of series`, () => {
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, maxPointsPerSeries)
    expect(_colourizeClusters([], `lightgrey`)(randomSeries)).toHaveLength(seriesNames.length)
  })

  test(`must not change the number of points in each series`, () => {
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series, i) => {
      expect(series.data).toHaveLength(randomSeries[i].data.length)
    })
  })

  test(`must not dim (i.e. add a color field) any series if all are highlighted`, () => {
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, maxPointsPerSeries)
    _colourizeClusters(seriesNames, `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).not.toHaveProperty(`color`)
      })
    })
  })

  test(`must not dim (i.e. add a color field) any series if none are passed to highlight`, () => {
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).not.toHaveProperty(`color`)
      })
    })
  })

  test(`dims all series but the highlighted ones`, () => {
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, maxPointsPerSeries)

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

describe(`ClusterTSnePlot`, () => {
  test(`with no data matches snapshot`, () => {
    const onChangeK = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }

    const tree = renderer
      .create(<ClusterTSnePlot height={500} ks={[]} selectedK={0} onChangeK={onChangeK} perplexities={[]} selectedPerplexity={0} onChangePerplexity={onChangePerplexity} loading={true} plotData={plotData}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test(`contains ScatterPlotLoader`, () => {
    const onChangeK = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }

    const wrapper = mount(<ClusterTSnePlot height={500} ks={[]} selectedK={0} onChangeK={onChangeK} perplexities={[]} selectedPerplexity={0} onChangePerplexity={onChangePerplexity} loading={true} plotData={plotData}/>)

    expect(wrapper.find(ScatterPlotLoader).length).toBe(1)
  })
})
