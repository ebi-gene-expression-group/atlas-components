import React from 'react'
import renderer from 'react-test-renderer'
import Color from 'color'

import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {_colourizeClusters} from '../src/ClusterTSnePlot'
import ClusterTSnePlot from '../src/ClusterTSnePlot'
import ScatterPlotLoader from '../src/plotloader/PlotLoader'
import PlotSettingsDropdown from '../src/PlotSettingsDropdown'

import '../src/util/MathRound'
import {randomHighchartsSeriesWithNamesAndMaxPoints} from './Utils'

Enzyme.configure({ adapter: new Adapter() })

const seriesNames = [`Cluster 0`, `Cluster 1`, `Cluster 2`, `Cluster 3`, `Cluster 4`]
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
        seriesNames.reduce((acc, seriesName, index) =>  Math.random() > 0.5 ? acc.concat(index) : acc, [])
    }

    const highlightRandomSeriesNames = highlightRandomSeries.map((series) => `Cluster ${series}`)

    _colourizeClusters(highlightRandomSeries, `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        if (highlightRandomSeriesNames.includes(series.name)) {
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
    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }

    const tree = renderer
      .create(<ClusterTSnePlot height={500} ks={[]} metadata={[]} selectedColourBy={`0`} onChangeColourBy={onChangeColourBy} perplexities={[]} selectedPerplexity={0} onChangePerplexity={onChangePerplexity} loading={true} plotData={plotData}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test(`contains ScatterPlotLoader`, () => {
    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }

    const wrapper = mount(<ClusterTSnePlot height={500} ks={[]} metadata={[]} selectedColourBy={`0`} onChangeColourBy={onChangeColourBy} perplexities={[]} selectedPerplexity={0} onChangePerplexity={onChangePerplexity} loading={true} plotData={plotData}/>)

    expect(wrapper.find(ScatterPlotLoader).length).toBe(1)
  })

  test(`contains 2 PlotSettingsDropdowns`, () => {
    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }

    const wrapper = mount(<ClusterTSnePlot height={500} ks={[]} metadata={[]} selectedColourBy={`0`} onChangeColourBy={onChangeColourBy} perplexities={[]} selectedPerplexity={0} onChangePerplexity={onChangePerplexity} loading={true} plotData={plotData}/>)

    expect(wrapper.find(PlotSettingsDropdown).length).toBe(2)
  })

  test(`dropdown selection text is to be "k = x" when plot is coloured by cluster ID x`, () => {
    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }
    const ks = [1, 2, 3]
    const metadata = [
      {
        value: `metadata-1`,
        label: `The first metadata value`
      }
    ]

    const wrapper = mount(<ClusterTSnePlot height={500} ks={ks} metadata={metadata} selectedColourBy={`2`} onChangeColourBy={onChangeColourBy} perplexities={[]} selectedPerplexity={0} onChangePerplexity={onChangePerplexity} loading={true} plotData={plotData}/>)

    const dropdown = wrapper.find({ labelText: `Colour plot by:`})

    expect(dropdown.props().defaultValue.label).toContain(`k = 2`)

  })

  test(`dropdown selection text is the name of the metadata when plot is coloured by metadata`, () => {
    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }
    const ks = [1, 2, 3]
    const metadata = [
      {
        value: `metadata-1`,
        label: `The first metadata value`
      }
    ]

    const wrapper = mount(<ClusterTSnePlot height={500} ks={ks} metadata={metadata} selectedColourBy={`metadata-1`} onChangeColourBy={onChangeColourBy} perplexities={[]} selectedPerplexity={0} onChangePerplexity={onChangePerplexity} loading={true} plotData={plotData}/>)

    const dropdown = wrapper.find({ labelText: `Colour plot by:`})

    expect(dropdown.props().defaultValue.label).toContain(`The first metadata value`)
  })
})
