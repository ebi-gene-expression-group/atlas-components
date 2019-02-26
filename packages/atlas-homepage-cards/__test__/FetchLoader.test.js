import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import '@babel/polyfill'
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

  const props = {
    host: `foo`,
    resource: `bar`
  }

  test(`until the fetch promise is not resolved a loading message is displayed, then goes away`, async () => {
    fetchMock.get(`*`, `[]`)
    const wrapper = shallow(<ComponentWithFetchLoader {...props} />)

    expect(wrapper.find(`.loading-message`)).toHaveLength(1)
    expect(wrapper.find(CalloutAlert)).toHaveLength(0)

    await wrapper.instance().componentDidMount()
    wrapper.update()

    expect(wrapper.find(`.loading-message`)).toHaveLength(0)
    expect(wrapper.find(CalloutAlert)).toHaveLength(0)
  })

  test(`renders an error message if the child receives invalid JSON (and the error boundary kicks in)`, async () => {
    fetchMock.get(`*`, `[]`)
    const wrapper = shallow(<ComponentWithFetchLoader {...props} />)

    const e = new Error(`They’re inside you building a monument to compromise!`)
    wrapper.instance().componentDidCatch(e, `Ruben’s seen some rough years, Morty.`)
    wrapper.update()
    expect(wrapper.find(CalloutAlert)).toHaveLength(1)
  })

  test(`renders an error message if request to the server returns 4xx or 5xx`, async () => {
    fetchMock.get(`*`, getRandomHttpErrorCode)
    const wrapper = shallow(<ComponentWithFetchLoader {...props} />)

    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(CalloutAlert)).toHaveLength(1)
  })

  test(`renders an error message if the component does not receive JSON`, async () => {
    fetchMock.get(`*`, `Break the cycle, Morty. Rise above. Focus on the science`)
    const wrapper = shallow(<ComponentWithFetchLoader {...props} />)

    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(CalloutAlert)).toHaveLength(1)
  })

  test(`re-fetches on props change and recovers from error if new fetch succeeds`, async () => {
    fetchMock.get(`/foo/bar`, getRandomHttpErrorCode)
    const wrapper = shallow(<ComponentWithFetchLoader {...props} />)

    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(CalloutAlert)).toHaveLength(1)

    fetchMock.get(`/pea/lentil`, `{"results":[]}`)
    wrapper.setProps({
      host: `pea/`,
      resource: `lentil`
    })

    await wrapper.instance().componentDidUpdate()
    wrapper.update()
    expect(wrapper.find(CalloutAlert)).toHaveLength(0)
  })

})
