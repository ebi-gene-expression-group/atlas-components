import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import fetchMock from 'fetch-mock'

import { getRandomInt } from './TestUtils'
import CalloutAlert from '../src/containers/CalloutAlert'
import withFetchLoader from '../src/containers/FetchLoader'

const getRandomHttpErrorCode = () => getRandomInt(400, 600)

Enzyme.configure({ adapter: new Adapter() })

const ComponentWithFetchLoader = withFetchLoader(() => <div></div>)

describe(`FetchLoader`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  test(`until the fetch promise is not resolved a loading message is displayed, then goes away`, async () => {
    fetchMock.get(`*`, `[]`)
    const wrapper = shallow(<ComponentWithFetchLoader host={`foo`} resource={`bar`}/>)

    expect(wrapper.find(`#loading-message`).exists()).toBe(true)
    expect(wrapper.find(CalloutAlert).exists()).toBe(false)
    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(`#loading-message`).exists()).toBe(false)
    expect(wrapper.find(CalloutAlert).exists()).toBe(false)
  })

  test(`renders an error message if request to the server returns 4xx or 5xx`, async () => {
    fetchMock.get(`*`, getRandomHttpErrorCode(400, 600))
    const wrapper = shallow(<ComponentWithFetchLoader host={`foo`} resource={`bar`}/>)

    await wrapper.instance().componentDidMount()
    wrapper.update()

    expect(wrapper.find(CalloutAlert).exists()).toBe(true)
  })

  test(`renders an error message if an error is caught by the error boundary`, async () => {
    fetchMock.get(`*`, `[]`)
    const wrapper = shallow(<ComponentWithFetchLoader host={`foo`} resource={`bar`}/>)

    const e = new Error(`This is an error!`)
    wrapper.instance().componentDidCatch(e, `Descriptive error message goes here`)
    wrapper.update()

    expect(wrapper.find(CalloutAlert).exists()).toBe(true)
  })
})
