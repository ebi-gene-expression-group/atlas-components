import React from 'react'
import { shallow, mount } from 'enzyme'

import { Table } from 'evergreen-ui'

import '@babel/polyfill'
import TableContent from '../src/TableContent'
import TableHeaderCell from '../src/head/TableHeaderCell'
import TableCell from '../src/TableCell'
import SelectionTableHeaderCell from '../src/head/SelectionTableHeaderCell'

import randomString from 'random-string'

import { getRandomInt, bulkTableHeaders, downloadFileTypes } from './TestUtils'
import bulkExperiments from './experiments-bulk.json'

describe(`TableContent`, () => {
  const props = {
    dataRows: [],
    tableHeaders: [],
    // Filter handling
    filters: {},
    tableHeaderCellOnChange: jest.fn(),
    // Ordering
    sortColumnIndex: 0,
    ascendingOrder: false,
    tableHeaderCellOnClick: jest.fn(),
    selectedRows: [],
    host: ``,
    downloadFileTypes: downloadFileTypes,
    selectOnChange: jest.fn()
  }

  test(`renders a table with head and body`, () => {
    const wrapper = shallow(<TableContent {...props}/>)

    expect(wrapper).toContainExactlyOneMatchingElement(Table)
    expect(wrapper.find(Table).find(Table.Head)).toHaveLength(1)
    expect(wrapper.find(Table).find(Table.Body)).toHaveLength(1)
  })

  test(`displays as many table header cells as there are in prop tableHeaders`, () => {
    const tableHeaders = bulkTableHeaders.filter(() => Math.random() < 0.5)
    const wrapper = shallow(<TableContent {...props} tableHeaders={tableHeaders}/>)

    expect(wrapper.find(Table).find(Table.Head).find(TableHeaderCell)).toHaveLength(tableHeaders.length)
  })

  test(`displays as many rows as there are in prop dataRows`, () => {
    const tableHeaders = bulkTableHeaders.filter(() => Math.random() < 0.5)
    const dataRows = bulkExperiments.filter(() => Math.random() < 0.5)
    const wrapper = shallow(<TableContent {...props} dataRows={dataRows} tableHeaders={tableHeaders}/>)

    expect(wrapper.find(Table).find(Table.Body).find(Table.Row)).toHaveLength(dataRows.length)
  })

  test(`displays as many columns as there are in prop tableHeaders`, () => {
    const tableHeaders = bulkTableHeaders.filter(() => Math.random() < 0.5)
    const dataRows = bulkExperiments.filter(() => Math.random() < 0.5)
    const wrapper = shallow(<TableContent {...props} dataRows={dataRows} tableHeaders={tableHeaders}/>)

    expect(wrapper.find(Table).find(Table.Body).find(Table.Row).first().find(TableCell))
      .toHaveLength(tableHeaders.length)
    expect(wrapper.find(Table).find(Table.Body).find(Table.Row).last().find(TableCell))
      .toHaveLength(tableHeaders.length)
  })

  test(`wires functions correctly to the table header cells`, () => {
    const tableHeaders = bulkTableHeaders.filter(() => Math.random() < 0.5)
    const dataRows = bulkExperiments.filter(() => Math.random() < 0.5)
    const wrapper = shallow(<TableContent {...props} dataRows={dataRows} tableHeaders={tableHeaders}/>)

    wrapper.find(Table).find(Table.Head).find(TableHeaderCell).first().simulate(`click`)
    wrapper.find(Table).find(Table.Head).find(TableHeaderCell).last().simulate(`click`)
    expect(props.tableHeaderCellOnClick).toHaveBeenCalledTimes(2)

    wrapper.find(Table).find(Table.Head).find(TableHeaderCell).first().simulate(`change`)
    wrapper.find(Table).find(Table.Head).find(TableHeaderCell).last().simulate(`change`)
    expect(props.tableHeaderCellOnChange).toHaveBeenCalledTimes(2)
  })

  test(`wires function correctly to the selection table header cell`, () => {
    const tableHeaders = bulkTableHeaders.filter(() => Math.random() < 0.5)
    const dataRows = bulkExperiments.filter(() => Math.random() < 0.5)
    const rowSelectionColumn = {
      label: randomString(),
      dataKey: tableHeaders[getRandomInt(0, tableHeaders.length)].dataKey,
      tooltipContent: randomString(),
      tableHeaderCellOnClick: jest.fn(),
      downloadFileTypes: downloadFileTypes
    }
    const wrapper =
      shallow(
        <TableContent
          {...props}
          dataRows={dataRows}
          tableHeaders={tableHeaders}
          rowSelectionColumn={rowSelectionColumn}/>)

    expect(wrapper.find(Table).find(Table.Head).find(SelectionTableHeaderCell)).toHaveLength(1)
    wrapper.find(Table).find(Table.Head).find(SelectionTableHeaderCell).simulate(`click`)
    expect(rowSelectionColumn.tableHeaderCellOnClick).toHaveBeenCalled()
  })

  test(`matches snapshot (without selection)`, () => {
    const wrapper =
      mount(<TableContent {...props} dataRows={bulkExperiments.slice(100, 150)} tableHeaders={bulkTableHeaders}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (with selection)`, () => {
    const rowSelectionColumn = {
      label: `Download`,
      dataKey: `experimentAccession`
      // Unfortunately ReactTooltip injects dynamically generated class names, and the rowSelectionColumn will cause the
      // snapshots not to match
      // tooltipContent: `Download experiment and stuff`
    }
    const wrapper =
      mount(
        <TableContent
          {...props}
          dataRows={bulkExperiments.slice(100, 150)}
          tableHeaders={bulkTableHeaders}
          rowSelectionColumn={rowSelectionColumn}
          selectedRows={bulkExperiments.slice(110, 120).map(dataRow => dataRow.experimentAccession)}/>)

    expect(wrapper).toMatchSnapshot()
  })
})
