import React from 'react'
// Highcharts can only be shallow-rendered unless it’s mocked, see __mocks__/highcharts.js
import {shallow, mount} from 'enzyme'

import '@babel/polyfill'
import ScatterPlot from '../../src/plotloader/ScatterPlot'
import {randomHighchartsSeriesWithSeed} from '../Utils'

// *IMPORTANT*: Highcharts and React Highcharts aren’t the easiest components to inspect for testing. The mysterious
//              `n` node was in earlier versions `HighchartsChart`. However the mock was also thinner, so who knows!

describe(`ScatterPlot`, () => {

  test(`merges additional options for Highcharts`, () => {
    const highchartsConfig = {
      chart: {
        height: `50%`, // existing property, overwritten
        width: `50%`   // new property
      }
    }
    const wrapper = mount(<ScatterPlot series={[]} highchartsConfig={highchartsConfig}/>)
    const highchartsWrapper = wrapper.find(`n`)
    expect(highchartsWrapper.prop(`config`)).toHaveProperty(`chart.height`, `50%`)
    expect(highchartsWrapper.prop(`config`)).toHaveProperty(`chart.width`, `50%`)
  })

  test(`uses a styled download button`, () => {
    const wrapper = mount(<ScatterPlot series={[]} />)
    const highchartsWrapper = wrapper.find(`n`)
    expect(highchartsWrapper.prop(`config`)).toHaveProperty(`exporting.buttons.contextButton.text`,
      `<i class="icon icon-functional" data-icon="="></i>&nbsp;Download`)
    expect(highchartsWrapper.prop(`config`)).toHaveProperty(`exporting.buttons.contextButton.symbol`, null)
  })

  test(`with no series matches snapshot`, () => {
    const tree = shallow(<ScatterPlot series={[]}/>)
    expect(tree).toMatchSnapshot()
  })

  test(`marker radius does not change depending on number of total points`, () => {
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
    const markerRadiusLongSeries = wrapper.find(`n`).prop(`config`).plotOptions.series.marker.radius

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
    const markerRadiusShortSeries = wrapper.find(`n`).prop(`config`).plotOptions.series.marker.radius

    expect(markerRadiusLongSeries).toBe(markerRadiusShortSeries)
  })

  test(`matches snapshot with randomized series`, () => {
    const series = randomHighchartsSeriesWithSeed()
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
