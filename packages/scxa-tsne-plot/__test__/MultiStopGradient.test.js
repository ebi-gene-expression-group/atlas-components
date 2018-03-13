import React from 'react'
import renderer from 'react-test-renderer'

import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import MultiStopGradient from '../src/MultiStopGradient'
import ScientificNotationNumber from 'expression-atlas-number-format'
import {gradientColourRanges, randomHighchartsSeries, randomHighchartsSeriesWithSeed, plotData} from './Utils'

Enzyme.configure({ adapter: new Adapter() })

describe(`MultiStopGradient`, () => {
  const GRADIENT_HEIGHT = 600

  test(`with random data matches snapshot`, () => {
    const randomSeries = randomHighchartsSeriesWithSeed()

    const tree = renderer
      .create(<MultiStopGradient height={GRADIENT_HEIGHT} showTicks={true} colourRanges={gradientColourRanges()} plotData={plotData(randomSeries)}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test(`displays 4 ticks, 2 on the right and 2 on the left`, () => {
    const randomSeries = randomHighchartsSeries()
    const wrapper = mount(<MultiStopGradient height={GRADIENT_HEIGHT} showTicks={true} colourRanges={gradientColourRanges()} plotData={plotData(randomSeries)}/>)

    expect(wrapper.find('.tick').length).toBe(4)
    expect(wrapper.find('.tick .right').length).toBe(2)
    expect( wrapper.find('.tick .left').length).toBe(2)
  })

  test(`min tick has a lower value and position than max tick`, () => {
    const randomSeries = randomHighchartsSeries()
    const data = plotData(randomSeries)
    const wrapper = mount(<MultiStopGradient height={GRADIENT_HEIGHT} showTicks={true} colourRanges={gradientColourRanges()} plotData={data}/>)

    // The max tick should be positioned higher than the min tick
    const maxTick = wrapper.find('.tick .left').parent().get(0)
    const minTick = wrapper.find('.tick .left').parent().get(0)

    expect(parseInt(maxTick.props.style.top)).toBeGreaterThanOrEqual(parseInt(minTick.props.style.top))

    // The first left tick should be the max expression value, the second the min expression value
    const maxTickNumber = wrapper.find('.tick .left').find(ScientificNotationNumber).get(0)
    const minTickNumber = wrapper.find('.tick .left').find(ScientificNotationNumber).get(1)

    expect(maxTickNumber.props.value).toBe(Math.round10(data.max, -2))
    expect(minTickNumber.props.value).toBe(Math.round10(data.min, -2))
  })

})
