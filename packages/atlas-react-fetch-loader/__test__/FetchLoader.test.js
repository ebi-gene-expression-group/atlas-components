import React from 'react'
import { shallow } from 'enzyme'

import '@babel/polyfill'
import fetchMock from 'fetch-mock'

import CalloutAlert from '../src/CalloutAlert'
import withFetchLoader from '../src/FetchLoader'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}
const getRandomHttpErrorCode = () => getRandomInt(400, 600)

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
