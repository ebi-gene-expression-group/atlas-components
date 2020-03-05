import React from 'react'
import {shallow} from 'enzyme'

import LoadingOverlay from '../../src/plotloader/LoadingOverlay'

describe(`LoadingOverlay`, () => {
  test(`is displayed when show is set to true`, () => {
    expect(shallow(<LoadingOverlay show={true} />).prop(`style`)).toHaveProperty(`display`, `flex`)
  })

  test(`is hidden when show is set to false`, () => {
    expect(shallow(<LoadingOverlay show={false} />).prop(`style`)).toHaveProperty(`display`, `none`)
  })
})
