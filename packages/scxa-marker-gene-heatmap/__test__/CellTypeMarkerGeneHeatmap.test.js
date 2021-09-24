import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import '@babel/polyfill'
import MarkerGeneHeatmap from '../src/MarkerGeneHeatmap'

Enzyme.configure({ adapter: new Adapter() })

describe(`MarkerGeneHeatmap`, () => {
  test(`creates plot lines for every cell type`, () => {
    const wrapper = shallow(<MarkerGeneHeatmap
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
      species={`species`}
      heatmapType={`celltypes`} />)

    const chartOptions = wrapper.props().options

    expect(chartOptions.yAxis.plotLines).toHaveLength(3)
  })

  test(`does have data export options and a styled button`, () => {
    const wrapper = shallow(<MarkerGeneHeatmap
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
      species={`species`}
      heatmapType={`celltypes`} />)

    const chartOptions = wrapper.props().options

    expect(chartOptions.exporting.buttons.contextButton.text).toEqual(
      `Download`)

    expect(chartOptions.exporting.buttons.contextButton.symbol).toEqual(`download`)

    expect(chartOptions.exporting.buttons.contextButton.menuItems).toEqual(
      [
        `downloadPNG`,
        `downloadJPEG`,
        `downloadPDF`,
        `downloadSVG`,
        `separator`,
        `downloadCSV`,
        `downloadXLS`
      ]
    )
  })
})
