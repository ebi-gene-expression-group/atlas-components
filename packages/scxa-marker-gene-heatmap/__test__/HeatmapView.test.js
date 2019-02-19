import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import HeatmapView from '../src/HeatmapView'
import CalloutAlert from '../src/CalloutAlert'

Enzyme.configure({ adapter: new Adapter() })

describe(`HeatmapView`, () => {
  test(`Renders error if API request is unsuccessful`, () => {
    const wrapper = shallow(<HeatmapView
      host={`foo`}
      resource={`bar`}
      ks={[1, 2, 3, 4]}
      selectedK={`1`}/>)

    expect(wrapper.exists(CalloutAlert)).toBe(true)
  })
})
