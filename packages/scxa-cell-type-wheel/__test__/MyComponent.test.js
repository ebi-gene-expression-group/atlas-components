// If you get ReferenceError: regeneratorRuntime is not defined use this in your tests:
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'
import React from 'react'
import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'

import MyComponent from '../src/MyComponent'

describe(`MyComponent`, () => {
  test(`should mount in a full DOM`, () => {
    render(<MyComponent />)
    expect(screen.getByRole(`heading`)).toBeInTheDocument()
  })

  test(`should render to static HTML`, () => {
    render(<MyComponent />)
    expect(screen.getByRole(`heading`)).toHaveTextContent(`Bar`)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<MyComponent />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
