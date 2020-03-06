import React from 'react'
import { mount } from 'enzyme'

import LoadingOverlay from '../src/LoadingOverlay'

describe(`LoadingOverlay`, () => {
  test(`matches snapshot when shown`, () => {
    expect(mount(<LoadingOverlay show={true}/>)).toMatchSnapshot()
  })

  test(`matches snapshot when hidden`, () => {
    expect(mount(<LoadingOverlay show={false}/>)).toMatchSnapshot()
  })
})
