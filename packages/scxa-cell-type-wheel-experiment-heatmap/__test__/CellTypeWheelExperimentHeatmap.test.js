/**
 * @jest-environment jsdom
 */

import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from '@testing-library/react'

import CellTypeWheelExperimentHeatmap from '../src/CellTypeWheelExperimentHeatmap'

const props = {
  searchTerm: `pancreas`
}

describe(`CellTypeWheelExperimentHeatmap`, () => {
  test(`renders properly with no data`, () => {
    const { getByLabelText } = render(<CellTypeWheelExperimentHeatmap {...props} />)
    expect(getByLabelText(/Cell type wheel and heatmap/)).not.toBeEmptyDOMElement()
  })
})
