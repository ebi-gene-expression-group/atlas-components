import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EbiSpeciesIcon from 'react-ebi-species'

import { getRandomInt } from './TestUtils'
import {
  aRickleInTimeImageCardProps, theSmithHouseholdImageCardProps,
  batmanFilmsSpeciesCardProps, findingNemoSpeciesCardProps
 } from './TestUtils'
import ExtendableCard from '../src/cards/ExtendableCard'

Enzyme.configure({ adapter: new Adapter() })

describe(`ExtendableCard`, () => {
  test.each([ [aRickleInTimeImageCardProps.description.text, aRickleInTimeImageCardProps],
              [theSmithHouseholdImageCardProps.description.text, theSmithHouseholdImageCardProps],
              [batmanFilmsSpeciesCardProps.description.text, batmanFilmsSpeciesCardProps],
              [findingNemoSpeciesCardProps.description.text, findingNemoSpeciesCardProps] ])(
    `matches snapshot: %s`, (titleText, props) => {
    const tree = renderer.create(<ExtendableCard {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test(`can render species cards`, () => {
    const props = [batmanFilmsSpeciesCardProps, findingNemoSpeciesCardProps][getRandomInt(0, 2)]
    const wrapper = shallow(<ExtendableCard {...props}/>)
    expect(wrapper.find(EbiSpeciesIcon).exists()).toBe(true)
    expect(wrapper.find(`img`).exists()).toBe(false)
  })

  test(`can render image cards`, () => {
    const props = [aRickleInTimeImageCardProps, theSmithHouseholdImageCardProps][getRandomInt(0, 2)]
    const wrapper = shallow(<ExtendableCard {...props}/>)
    expect(wrapper.find(EbiSpeciesIcon).exists()).toBe(false)
    expect(wrapper.find(`img`).exists()).toBe(true)

  })

  test(`does not render optional empty title and content`, () => {
    const props = {
      iconType: [`species`, `image`][getRandomInt(0, 2)],
      iconSrc: ``
    }
    const wrapper = shallow(<ExtendableCard {...props} />)

    expect(wrapper.find(`h4`).exists()).toBe(false)
    expect(wrapper.find(`li`).exists()).toBe(false)
  })

  test(`does not render non-existent URLs in title`, () => {
    const props = [theSmithHouseholdImageCardProps, batmanFilmsSpeciesCardProps][getRandomInt(0, 2)]

    const wrapper = shallow(<ExtendableCard {...props} />)

    expect(wrapper.find(`h4`).exists()).toBe(true)
    expect(wrapper.find(`h4`).text()).toBe(props.description.text)
    expect(wrapper.find(`h4 a`).exists()).toBe(false)
  })

  test(`does not render non-existent URLs in content`, () => {
    const props = [aRickleInTimeImageCardProps, findingNemoSpeciesCardProps][getRandomInt(0, 2)]

    const wrapper = shallow(<ExtendableCard {...props} />).find(`ul`)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find(`li`)).toHaveLength(Math.min(props.content.length, 5))
    expect(wrapper.find(`li a`).exists()).toBe(false)
  })

  test(`displays up to five content items by default with a button to show/hide the others`, () => {
    const props = [aRickleInTimeImageCardProps, batmanFilmsSpeciesCardProps][getRandomInt(0, 2)]
    expect(props.content.length).toBeGreaterThan(5)

    const wrapper = shallow(<ExtendableCard {...props} />)
    expect(wrapper.find(`li`)).toHaveLength(5)
    wrapper.find(`button`).at(0).simulate(`click`)
    wrapper.update()
    expect(wrapper.find(`li`)).toHaveLength(props.content.length)
    wrapper.find(`button`).at(0).simulate(`click`)
    wrapper.update()
    expect(wrapper.find(`li`)).toHaveLength(5)
  })
})
