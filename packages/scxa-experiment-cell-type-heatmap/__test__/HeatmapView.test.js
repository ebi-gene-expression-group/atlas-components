import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import '@babel/polyfill'
import fetchMock from 'fetch-mock'

import HeatmapView from '../src/HeatmapView'
import CalloutAlert from '../src/CalloutAlert'

Enzyme.configure({ adapter: new Adapter() })

describe(`HeatmapView`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  const props = {
    host: `foo/`,
    resource: `bar`,
    type: `cluster`,
    props: {
      ks: [1, 2, 3, 4],
      selectedK: `1`,
      species: `species`
    }
  }

  test(`renders error if API request is unsuccessful`, () => {
    const wrapper = shallow(<HeatmapView {...props} />)
    expect(wrapper.exists(CalloutAlert)).toBe(true)
  })
})
