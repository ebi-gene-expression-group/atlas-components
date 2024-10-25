import React from 'react'
import { render } from '@testing-library/react'

import LoadingOverlay from '../src/LoadingOverlay'

describe(`LoadingOverlay`, () => {
  test(`matches snapshot when shown`, () => {
    const { asFragment } = render(<LoadingOverlay show={true} />)
    expect(asFragment()).toMatchSnapshot()
  })

  test(`matches snapshot when hidden`, () => {
    const { asFragment } = render(<LoadingOverlay show={false} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
