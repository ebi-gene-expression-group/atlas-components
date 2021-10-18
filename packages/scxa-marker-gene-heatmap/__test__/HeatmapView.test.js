import React from 'react'
import Enzyme, {mount} from 'enzyme'
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
    species: `species`,
    heatmapType: `clusters`
  }

  test(`renders error if API request is unsuccessful`, () => {
    const wrapper = shallow(<HeatmapView {...props} />)
    expect(wrapper.exists(CalloutAlert)).toBe(true)
  })

  test(`matches snapshot when heatmap type is multiexperimentcelltypes`, () => {
    expect(mount(<HeatmapView {...props} heatmapType={`multiexperimentcelltypes`}/>)).toMatchSnapshot()
  })

  test(`matches snapshot when heatmap type is clusters`, () => {
    expect(mount(<HeatmapView {...props} heatmapType={`clusters`}/>)).toMatchSnapshot()
  })

  test(`matches snapshot when heatmap type is celltypes`, () => {
    expect(mount(<HeatmapView {...props} heatmapType={`celltypes`}/>)).toMatchSnapshot()
  })
})
