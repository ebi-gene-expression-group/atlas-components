import React from 'react'
// Highcharts can only be shallow-rendered unless it’s mocked, see __mocks__/highcharts.js
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import HighchartsSeriesGenerator from 'highcharts-series-generator'

import ScatterPlot from '../../src/plotloader/ScatterPlot'

Enzyme.configure({ adapter: new Adapter() })

describe(`ScatterPlot`, () => {

  test(`merges additional options for Highcharts`, () => {
    const highchartsConfig = {
      chart: {
        height: `50%`, // existing property, overwritten
        width: `50%`   // new property
      }
    }
    const wrapper = mount(<ScatterPlot series={[]} highchartsConfig={highchartsConfig}/>)
    const highchartsWrapper = wrapper.find(`HighchartsChart`)
    expect(highchartsWrapper.prop(`config`)).toHaveProperty(`chart.height`, `50%`)
    expect(highchartsWrapper.prop(`config`)).toHaveProperty(`chart.width`, `50%`)
  })

  test(`with no series matches snapshot`, () => {
    const tree = shallow(<ScatterPlot series={[]}/>)
    expect(tree).toMatchSnapshot()
  })

  test(`marker radius changes depending on number of total points`, () => {
    const wrapper = mount(<ScatterPlot series={[]}/>)

    const longSeriesName = `Series with 5,000 points`
    const longSeriesData = []
    for (let i = 0 ; i < 5000 ; i++) {
      longSeriesData.push({
        name: `Point ${i}`,
        x: 0,
        y: 0,
        expressionLevel: 0
      })
    }
    const longSeries = {
      name: longSeriesName,
      data: longSeriesData
    }
    wrapper.setProps({ series: [longSeries] }).mount()
    const markerRadiusLongSeries = wrapper.find(`HighchartsChart`).prop(`config`).plotOptions.series.marker.radius

    const shortSeriesName = `Series with 4,999 points`
    const shortSeriesData = []
    for (let i = 0 ; i < 4999 ; i++) {
      shortSeriesData.push({
        name: `Point ${i}`,
        x: 0,
        y: 0,
        expressionLevel: 0
      })
    }
    const shortSeries = {
      name: shortSeriesName,
      data: shortSeriesData
    }
    wrapper.setProps({ series: [shortSeries] }).mount()
    const markerRadiusShortSeries = wrapper.find(`HighchartsChart`).prop(`config`).plotOptions.series.marker.radius

    expect(markerRadiusLongSeries).toBeLessThan(markerRadiusShortSeries)
  })

  test(`matches snapshot with randomized series`, () => {
    const seed = `A hair, Morty. I need one of your hairs. This isn’t Game of Thrones.`
    const seriesNames = [`Series 1`, `Series 2`, `Series 3`, `Series 4`, `Series 5`]
    const maxPointsPerSeries = 1000
    const series = HighchartsSeriesGenerator.generate(seriesNames, maxPointsPerSeries, seed)
    const tree = shallow(<ScatterPlot series={series}/>)
    expect(tree).toMatchSnapshot()
  })

  test(`doesn’t check for unique names in the same series or among different series`, () => {
    const series = {
      series: [
        {
          name: `Cluster 1`,
          data: [
            {x: 0, y: 0, name: `Cell A`, expressionLevel: 0},
            {x: 0, y: 0, name: `Cell A`, expressionLevel: 0},
            {x: 1.11111, y: 2.22222, name: `Cell B`, expressionLevel: 9.99999}
          ]
        },
        {
          name: `Cluster 2`,
          data: [
            {x: 0, y: 0, name: `Cell A`, expressionLevel: 0},
            {x: 1.11111, y: 2.22222, name: `Cell B`, expressionLevel: 9.99999}
          ]
        },
        {
          name: `Cluster 3`,
          data: [
            {x: 1.11111, y: 2.22222, name: `Cell A`, expressionLevel: 9.99999}
          ]
        }
      ]
    }

    const tree = shallow(<ScatterPlot {...series}/>)
    expect(tree).toMatchSnapshot()
  })
})
