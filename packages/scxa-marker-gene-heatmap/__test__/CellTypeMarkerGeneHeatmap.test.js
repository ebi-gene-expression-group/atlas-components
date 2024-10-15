import React from 'react'
import { render, screen } from '@testing-library/react'
import MarkerGeneHeatmap from '../src/MarkerGeneHeatmap'

describe(`MarkerGeneHeatmap`, () => {
  test(`creates plot lines for every cell type`, () => {
    const { container } = render(
      <MarkerGeneHeatmap
        data={[
          {
            x: 0,
            y: 0,
            geneName: `foo`,
            value: 13,
            cellGroupValue: `1`,
            cellGroupValueWhereMarker: `1`
          },
          {
            x: 1,
            y: 1,
            geneName: `bar`,
            value: 2,
            cellGroupValue: `2`,
            cellGroupValueWhereMarker: `2`
          },
          {
            x: 2,
            y: 2,
            geneName: `foobar`,
            value: 1,
            cellGroupValue: `3`,
            cellGroupValueWhereMarker: `3`
          }
        ]}
        xAxisCategories={[`1`, `2`, `3`]}
        yAxisCategories={[`a`, `b`, `c`]}
        chartHeight={200}
        heatmapRowHeight={20}
        hasDynamicHeight={false}
        species="species"
        heatmapType="celltypes"
      />
    )

    const plotLines = container.querySelectorAll('[class^="highcharts-plot-line "]')
    expect(plotLines).toHaveLength(3)
  })

  test(`has data export options and a styled button`, () => {
    const { container } = render(
      <MarkerGeneHeatmap
        data={[
          {
            x: 0,
            y: 0,
            geneName: `foo`,
            value: 13,
            cellGroupValue: `1`,
            cellGroupValueWhereMarker: `1`
          }
        ]}
        xAxisCategories={[`1`, `2`, `3`]}
        yAxisCategories={[`a`, `b`, `c`]}
        chartHeight={200}
        heatmapRowHeight={20}
        hasDynamicHeight={false}
        species="species"
        heatmapType="celltypes"
      />
    )

    // Use screen to query the button
    expect(screen.getByText(`Download`)).toBeInTheDocument()
  })
})
