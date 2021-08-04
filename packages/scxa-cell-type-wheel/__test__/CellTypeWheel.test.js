// If you get ReferenceError: regeneratorRuntime is not defined use this in your tests:
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'
import React from 'react'
import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'

import CellTypeWheel from '../src/CellTypeWheel'

describe(`CellTypeWheel`, () => {
  test(`should mount in a full DOM`, () => {
    render(<CellTypeWheel />)
    expect(screen.getByRole(`heading`)).toBeInTheDocument()
  })

  test(`should render to static HTML`, () => {
    render(<CellTypeWheel />)
    expect(screen.getByRole(`heading`)).toHaveTextContent(`Bar`)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<CellTypeWheel />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
