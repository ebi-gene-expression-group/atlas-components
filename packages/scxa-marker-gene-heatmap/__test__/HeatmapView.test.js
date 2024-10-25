import React from 'react'
import { render, screen } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import HeatmapView from '../src/HeatmapView'

describe(`HeatmapView`, () => {
  const props = {
    host: `foo/`,
    resource: `bar`,
    species: `species`,
    heatmapType: `clusters`
  }

  beforeEach(() => {
    fetchMock.restore()
  })

  test(`renders error if API request is unsuccessful`, () => {
    render(<HeatmapView {...props} />)

    // Check if CalloutAlert is rendered
    expect(screen.getByText((content, element) => {
      return content.includes(`Error`)
    })).toBeInTheDocument()
  })

  test(`matches snapshot when heatmap type is multiexperimentcelltypes`, () => {
    const { asFragment } = render(<HeatmapView {...props} heatmapType="multiexperimentcelltypes" />)
    expect(asFragment()).toMatchSnapshot()
  })

  test(`matches snapshot when heatmap type is clusters`, () => {
    const { asFragment } = render(<HeatmapView {...props} heatmapType="clusters" />)
    expect(asFragment()).toMatchSnapshot()
  })

  test(`matches snapshot when heatmap type is celltypes`, () => {
    const { asFragment } = render(<HeatmapView {...props} heatmapType="celltypes" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
