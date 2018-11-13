import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import fetchMock from 'fetch-mock'

import {getRandomInt, dummyCards} from './TestUtils'

import CardContainer from '../src/CardContainer'
import SpeciesCard from '../src/SpeciesCard'
import ImageCard from '../src/ImageCard'
import ExtendableSpeciesCard from '../src/ExtendableSpeciesCard'

const getRandomHttpErrorCode = () => getRandomInt(400, 600)

Enzyme.configure({ adapter: new Adapter() })

describe(`CardContainer`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  test(`with no data matches snapshot`, () => {
    const tree = renderer.create(<CardContainer host={``} resource={``}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test(`until the fetch promise is not resolved a loading message is displayed, then goes away`, async () => {
    fetchMock.get(`*`, `[]`)
    const wrapper = mount(<CardContainer host={`foo`} resource={`bar`}/>)

    expect(wrapper.find(`#loading-message`).exists()).toBe(true)
    expect(wrapper.find(`.callout.alert`).exists()).toBe(false)
    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(`#loading-message`).exists()).toBe(false)
    expect(wrapper.find(`.callout.alert`).exists()).toBe(false)
  })

  test(`renders an error message if request to the server returns 4xx or 5xx`, async () => {
    fetchMock.get(`*`, getRandomHttpErrorCode(400, 600))
    const wrapper = mount(<CardContainer host={`foo`} resource={`bar`}/>)

    await wrapper.instance().componentDidMount()
    wrapper.update()

    expect(wrapper.find(`.callout.alert`).exists()).toBe(true)
  })

  test(`renders an error message if an error is caught by the error boundary`, async () => {
    fetchMock.get(`*`, `[]`)
    const wrapper = mount(<CardContainer host={`foo`} resource={`bar`}/>)

    const e = new Error(`This is an error!`)
    wrapper.instance().componentDidCatch(e, `Descriptive error message goes here`)
    wrapper.update()

    expect(wrapper.find(`.callout.alert`).exists()).toBe(true)
  })

  test(`renders cards of different types, or nothing if type is unknown`, async () => {
    fetchMock.get(`*`, dummyCards())
    const wrapper = mount(<CardContainer host={`foo`} resource={`bar`}/>)

    await wrapper.instance().componentDidMount()
    wrapper.update()

    expect(wrapper.find(SpeciesCard)).toHaveLength(2)
    expect(wrapper.find(ImageCard)).toHaveLength(1)
    expect(wrapper.find(ExtendableSpeciesCard)).toHaveLength(1)
  })

  test(`renders species cards using 3 by 3 css style`, async () => {
    fetchMock.get(`*`, dummyCards().slice(0,2))
    const wrapper = mount(<CardContainer host={`foo`} resource={`bar`}/>)

    await wrapper.instance().componentDidMount()
    wrapper.update()

    expect(wrapper.find(SpeciesCard)).toHaveLength(2)
    expect(wrapper.find(`.row.small-up-2.medium-up-3`).exists()).toBe(true)
  })

  test(`renders non-species cards without using 3 by 3 css style`, async () => {
    fetchMock.get(`*`, dummyCards().slice(-3))
    const wrapper = mount(<CardContainer host={`foo`} resource={`bar`}/>)

    await wrapper.instance().componentDidMount()
    wrapper.update()

    expect(wrapper.find(ImageCard)).toHaveLength(1)
    expect(wrapper.find(ExtendableSpeciesCard)).toHaveLength(1)
    expect(wrapper.find(`.row.small-up-2.medium-up-3`).exists()).toBe(false)
  })
})
