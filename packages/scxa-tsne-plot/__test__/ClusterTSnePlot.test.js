import React from 'react'
import renderer from 'react-test-renderer'
import Color from 'color'

import {mount} from 'enzyme'

import '@babel/polyfill'
import {_colourizeClusters, tooltipHeader} from '../src/ClusterTSnePlot'
import ClusterTSnePlot from '../src/ClusterTSnePlot'
import ScatterPlotLoader from '../src/plotloader/PlotLoader'
import PlotSettingsDropdown from '../src/PlotSettingsDropdown'

import '../src/util/MathRound'
import {randomHighchartsSeriesWithNamesAndMaxPoints} from './Utils'

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

  test(`must dim if metadata is Not Available`, () => {
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints([...seriesNames, `Not available`], maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series) => {
      if(series.name === `Not available`) {
        expect(series).toHaveProperty(`color`)
      } else {
        expect(series).not.toHaveProperty(`color`)
      }
    })
  })

  test(`must move behind if metadata is Not Available`, () => {
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints([...seriesNames, `Not available`], maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series) => {
      if(series.name === `Not available`) {
        expect(series).toHaveProperty(`zIndex`, -1)
      } else {
        expect(series).not.toHaveProperty(`zIndex`)
      }
    })
  })

  test(`must not dim (i.e. add a color field) any series if none are passed to highlight`, () => {
    const randomSeries = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, maxPointsPerSeries)
    _colourizeClusters([], `lightgrey`)(randomSeries).forEach((series) => {
      series.data.forEach((point) => {
        expect(point).not.toHaveProperty(`color`,  Color(`lightgrey`).alpha(0.65).rgb().toString())
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
          expect(series).not.toHaveProperty(`color`)
        } else {
          expect(series).toHaveProperty(`color`, Color(`lightgrey`).alpha(0.65).rgb().toString())
        }
      })
    })
  })
})

describe(`ClusterTSnePlot`, () => {

  const props = {
    onChangeColourBy: () => {},
    onChangePerplexity: () => {},
    onChangePlotOptions: () => {},
    onChangePlotTypes: () => {},
    plotData: {
      series: []
    },
    plotTypeDropdown: [
      {
        plotType: `tSNE`,
        plotOptionsLabel: `Perplexities`,
        plotOptions: [1, 2, 3, 4]
      },
      {
        plotType: `UMAP`,
        plotOptionsLabel: `N-neighbors`,
        plotOptions: [1, 2, 3]
      }
    ],
    selectedParameter: 10,
    selectedPlotType: `tSNE`,
    height: 500,
    metadata: [],
    ks: [],
    perplexities: [],
    loading: true
  }

  test(`with no data matches snapshot`, () => {
    const tree = renderer
      .create(<ClusterTSnePlot {...props} selectedColourBy={`0`} selectedColourCategory={`clusters`} showControls={true}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test(`contains ScatterPlotLoader`, () => {
    const wrapper = mount(<ClusterTSnePlot {...props} selectedColourBy={`0`} selectedColourCategory={`clusters`} showControls={true}/>)

    expect(wrapper.find(ScatterPlotLoader).length).toBe(1)
  })

  test(`contains 3 PlotSettingsDropdowns`, () => {
    const wrapper = mount(<ClusterTSnePlot {...props} selectedColourBy={`0`} selectedColourCategory={`clusters`} showControls={true}/>)

    expect(wrapper.find(PlotSettingsDropdown).length).toBe(1)
  })

  test(`contains only 1 PlotSettingsDropdowns when showControls is false`, () => {
    const wrapper = mount(<ClusterTSnePlot {...props} selectedColourBy={`0`} selectedColourCategory={`clusters`} showControls={false}/>)

    expect(wrapper.find(PlotSettingsDropdown).length).toBe(1)
  })

  test(`dropdown selection text is to be "k = x" when plot is coloured by cluster ID x`, () => {
    const ks = [1, 2, 3]
    const metadata = [
      {
        value: `metadata-1`,
        label: `The first metadata value`
      }
    ]

    const wrapper = mount(<ClusterTSnePlot {...props} ks={ks} metadata={metadata} selectedColourBy={`2`} selectedColourCategory={`clusters`} showControls={true}/>)

    const dropdown = wrapper.find({ labelText: `Colour plot by:`})

    expect(dropdown.props().defaultValue.label).toContain(`k = 2`)

  })

  test(`dropdown selection text is the name of the metadata when plot is coloured by metadata`, () => {
    const ks = [1, 2, 3]
    const metadata = [
      {
        value: `metadata-1`,
        label: `The first metadata value`
      }
    ]

    const wrapper = mount(<ClusterTSnePlot {...props} ks={ks} metadata={metadata} selectedColourBy={`metadata-1`} selectedColourCategory={`metadata`} showControls={true}/>)

    const dropdown = wrapper.find({ labelText: `Colour plot by:`})

    expect(dropdown.props().defaultValue.label).toContain(`The first metadata value`)
  })

  test(`dropdown selection text only have metadata if ks is empty`, () => {
    const ks = []
    const metadata = [
      {
        value: `metadata-1`,
        label: `The first metadata value`
      }
    ]

    const wrapper = mount(<ClusterTSnePlot {...props} ks={ks} metadata={metadata} selectedColourBy={`metadata-1`} selectedColourCategory={`metadata`} showControls={true}/>)

    const dropdown = wrapper.find({ labelText: `Colour plot by:`})

    expect(dropdown.props()).not.toContain(`NUMBER OF CLUSTERS`)
  })

  test(`hides the cluster name in tooltips if tSNE is coloured by metadata`, () => {
    const randomSeries1 = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, 10).map(point => Object.assign(point, {clusterType: `clusters`}))
    const randomSeries2 = randomHighchartsSeriesWithNamesAndMaxPoints(seriesNames, 10).map(point => Object.assign(point, {clusterType: `metadata`}))
    randomSeries1.forEach(point => expect(tooltipHeader(point.clusterType, point, point)).toContain(`Cluster name`))
    randomSeries2.forEach(point => expect(tooltipHeader(point.clusterType, point, point)).not.toContain(`Cluster name`))
  })
})
