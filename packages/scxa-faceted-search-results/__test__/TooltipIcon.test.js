import React from 'react'
import randomWords from 'random-words'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import TooltipIcon from '../src/facetgroups/TooltipIcon'

Enzyme.configure({ adapter: new Adapter() })

describe(`TooltipIcon`, () => {
  test(`breaks very long tooltip texts`, () => {
    const longText = randomWords(100).join(` `)
    const wrapper = shallow(<TooltipIcon tooltipText={longText} />)
    expect(wrapper.find(`span`).prop(`data-tip`).split(`<br>`).length)
      .toBeGreaterThanOrEqual(Math.floor((longText.length / 40) - 1))
  })

  test(`matches snapshot`, () => {
    const longText = `The blowfish puffs himself up four, five times larger than normal and why? Why does he do that? So that it makes him intimidating, that's why. Intimidating! So that the other, scarier fish are scared off. And that's you! You are a blowfish. You see it's just all an illusion. You see it's... it's nothing but air. Now... who messes with the blowfish, Jesse? You're damn right. You are a blowfish. Say it again. Say it like you mean it. You're a BLOWFISH!`
    const tree = renderer.create(<TooltipIcon tooltipText={longText} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
