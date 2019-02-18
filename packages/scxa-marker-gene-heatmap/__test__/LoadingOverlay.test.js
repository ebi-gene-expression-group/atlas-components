import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

import LoadingOverlay from '../src/LoadingOverlay'

describe(`LoadingOverlay`, () => {
  test(`is displayed when show is set to true`, () => {
    expect(shallow(<LoadingOverlay show={true} />).prop(`style`)).toHaveProperty(`display`, `flex`)
  })

  test(`is hidden when show is set to false`, () => {
    expect(shallow(<LoadingOverlay show={false} />).prop(`style`)).toHaveProperty(`display`, `none`)
  })
})
