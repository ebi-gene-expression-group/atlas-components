import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EbiSpeciesIcon from 'react-ebi-species'

import { getRandomInt } from './TestUtils'
import { batmanFilmsSpeciesCardProps, findingNemoSpeciesCardProps } from './TestUtils'
import SpeciesCard from '../src/cards/SpeciesCard'

Enzyme.configure({ adapter: new Adapter() })

describe(`SpeciesCard`, () => {
  test.each([ [batmanFilmsSpeciesCardProps.description.text, batmanFilmsSpeciesCardProps],
              [findingNemoSpeciesCardProps.description.text, findingNemoSpeciesCardProps] ])(
    `matches snapshot: %s`, (titleText, props) => {
    const tree = renderer.create(<SpeciesCard {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test(`does not render optional empty title and content`, () => {
    const wrapper = shallow(<SpeciesCard iconType={`species`} iconSrc={``} />)

    expect(wrapper.find(EbiSpeciesIcon).exists()).toBe(true)
    expect(wrapper.find(`h5`).exists()).toBe(false)
    expect(wrapper.find(`li`).exists()).toBe(false)
    expect(wrapper.find(`ul`).exists()).toBe(false)
  })

  test(`does not render non-existent URLs`, () => {
    const props = findingNemoSpeciesCardProps
    const wrapper = shallow(<SpeciesCard {...props} />)

    expect(wrapper.find(`h5`).exists()).toBe(true)
    expect(wrapper.find(`h5`).text()).toBe(props.description.text)
    expect(wrapper.find(`h5 a`).exists()).toBe(Boolean(props.description.url))

    const contentWrapper = wrapper.find(`ul`)

    expect(contentWrapper.exists()).toBe(true)
    expect(contentWrapper.find(`li`)).toHaveLength(props.content.length)
    expect(contentWrapper.find(`li a`).exists()).toBe(Boolean(props.content[0].url))
  })

  test(`renders URLs`, () => {
    const props = batmanFilmsSpeciesCardProps
    props.description.url = `#`

    const wrapper = shallow(<SpeciesCard {...props}/>)

    expect(wrapper.find(`h5 a`).exists()).toBe(true)
    expect(wrapper.find(`li a`)).toHaveLength(props.content.length)
  })
})
