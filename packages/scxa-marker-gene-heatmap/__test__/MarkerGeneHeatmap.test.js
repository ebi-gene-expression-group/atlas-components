import React from 'react'
import { render } from '@testing-library/react'
import MarkerGeneHeatmap from '../src/MarkerGeneHeatmap'
import data from '../html/cell-types-data.json'
import _ from "lodash"

const props = {
  data,
  xAxisCategories: _.chain(data).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value(),
  yAxisCategories: _.chain(data).uniqBy(`y`).sortBy(`y`).map(`geneName`).value(),
  hasDynamicHeight: _.chain(data).map(`geneName`).uniq().value().length > 5,
  heatmapRowHeight: `500px`,
  species: `species`,
  host: `host`
}

describe(`MarkerGeneHeatmap`, () => {
  test(`matches snapshot when heatmap type is multiexperimentcelltypes`, () => {
    const { container } = render(<MarkerGeneHeatmap {...props} heatmapType="multiexperimentcelltypes" />)
    expect(container).toMatchSnapshot()
  })

  test(`matches snapshot when heatmap type is clusters`, () => {
    const { asFragment } = render(<MarkerGeneHeatmap {...props} heatmapType="clusters" />)
    expect(asFragment()).toMatchSnapshot()
  })

  test(`matches snapshot when heatmap type is celltypes`, () => {
    const { asFragment } = render(<MarkerGeneHeatmap {...props} heatmapType="celltypes" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
