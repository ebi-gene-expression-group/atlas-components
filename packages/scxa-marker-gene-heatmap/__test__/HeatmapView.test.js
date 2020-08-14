import React from 'react'
import { shallow } from 'enzyme'

import '@babel/polyfill'
import fetchMock from 'fetch-mock'

import HeatmapView from '../src/HeatmapView'
import CalloutAlert from '../src/CalloutAlert'

describe(`HeatmapView`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  const props = {
    host: `foo/`,
    resource: `bar`,
    ks: [1, 2, 3, 4],
    selectedK: `1`,
    species: `species`
  }

  test(`renders error if API request is unsuccessful`, () => {
    const wrapper = shallow(<HeatmapView {...props} />)
    expect(wrapper.exists(CalloutAlert)).toBe(true)
  })
})
