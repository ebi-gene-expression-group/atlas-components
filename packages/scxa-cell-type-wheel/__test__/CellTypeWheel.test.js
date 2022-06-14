/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render } from '@testing-library/react'

import CellTypeWheel from '../src/CellTypeWheel'

const props = {
  searchTerm: `foobar`,
  data: [],
  // {
  //   id: `level1#level2#level3`,,
  //   name: `level3`,
  //   parent: `level1#level2`,
  //   value: 1,
  //   experimentAccessions: [`E-EHCA-2`, `E-MTAB-5061`]
  // }
  onCellTypeWheelClick: () => {}
}

describe(`CellTypeWheel`, () => {
  test(`renders properly with no data`, () => {
    const { getByRole } = render(<CellTypeWheel {...props} />)
    expect(getByRole(`figure`)).not.toBeEmptyDOMElement()
  })
})
