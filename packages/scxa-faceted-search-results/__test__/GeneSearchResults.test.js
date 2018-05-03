import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import fetchMock from 'fetch-mock'

import GeneSearchResults from '../src/GeneSearchResults'

Enzyme.configure({ adapter: new Adapter() })

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

describe(`FacetedSearchResults`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  const defaultProps = {
    host: `glip/`,
    resource: `glops`
  }

  const getRandomHttpErrorCode = () => getRandomInt(400, 600)

  test(`renders an error message if request to the server returns 4xx or 5xx`, async () => {
    fetchMock.get('*', getRandomHttpErrorCode);
    const wrapper = mount(<GeneSearchResults {...defaultProps} />)

    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(`.callout .alert`)).toHaveLength(1)
  })

  test(`renders an error message if the component receives invalid JSON`, async () => {
    fetchMock.get('*', getRandomHttpErrorCode);
    const wrapper = mount(<GeneSearchResults {...defaultProps} />)

    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(`.callout .alert`)).toHaveLength(1)
  })

  test(`renders an error message if an unknown error happens`, async () => {
    fetchMock.get('*', getRandomHttpErrorCode);
    const wrapper = mount(<GeneSearchResults {...defaultProps} />)

    await wrapper.instance().componentDidMount()
    wrapper.update()
    expect(wrapper.find(`.callout .alert`)).toHaveLength(1)
  })

})
