import React from 'react'
import { shallow, mount } from 'enzyme'
import _ from 'lodash'

import '@babel/polyfill'
import TableManager from '../src/TableManager'

import TablePreamble from '../src/TablePreamble'
import TableContent from '../src/TableContent'
import TableFooter from '../src/TableFooter'

import randomString from 'random-string'
import {
  getRandomInt, randomSubstring,
  bulkTableHeaders, bulkDropdownFilters, bulkRowSelectionColumn,
  singleCellTableHeaders, singleCellDropdownFilters, singleCellRowSelectionColumn } from './TestUtils'
import bulkExperiments from './experiments-bulk.json'

const getRandomValueFromKeyedRows = (dataRows, dataKey) =>
  _.chain(dataRows)
    .map(dataRow => _.pick(dataRow, dataKey))
    .flatMapDeep(_.values)
    .sample()
    .value()

describe(`TableManager`, () => {
  const props = {
    tableHeaders: [],
    dropdownFilters: [],
    dataRows: []
  }

  test(`renders a TablePreamble, a TableContent and a TableFooter`, () => {
    const wrapper = shallow(<TableManager {...props}/>)

    expect(wrapper).toContainExactlyOneMatchingElement(TablePreamble)
    expect(wrapper).toContainExactlyOneMatchingElement(TableContent)
    expect(wrapper).toContainExactlyOneMatchingElement(TableFooter)
  })

  test(`can filter changing a randomly picked dropdown`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)

    const randomDropdownFilter = _.sample(bulkDropdownFilters)
    const randomDropdownValue = getRandomValueFromKeyedRows(bulkExperiments, randomDropdownFilter.dataKey)
    wrapper.find(TablePreamble).invoke(`dropdownOnChange`)(randomDropdownFilter.dataKey, randomDropdownValue)

    expect(wrapper).toHaveState({ filters: { [randomDropdownFilter.dataKey]: randomDropdownValue } })

    _.chain(wrapper.find(TableContent).prop(`dataRows`))
      .map(randomDropdownFilter.dataKey)
      // Fields can be multi-valued (i.e. arrays), so we convert all column values to arrays and validate below
      .map(dataRowValue => [].concat(dataRowValue))
      // All arrays must contain an element that matches case insensitively
      .forEach(
        dataRowValueArray =>
          expect(dataRowValueArray)
            .toEqual(expect.arrayContaining([expect.stringMatching(new RegExp(randomDropdownValue, `i`))])))
  })

  test(`can change the number of rows per page`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)
    expect(wrapper).toHaveState({ rowsPerPage: 10 })

    // We could also pick a random <option> value instead of a random integer, either way is fine
    const randomNatural = getRandomInt(1, 100)
    wrapper.find(TablePreamble).invoke(`rowsPerPageOnChange`)(randomNatural)

    expect(wrapper).toHaveState({ rowsPerPage: randomNatural })
    expect(wrapper.find(TableContent).prop(`dataRows`)).toHaveLength(randomNatural)
  })

  test(`displays all rows if we set the rows per page to 0`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)

    wrapper.find(TablePreamble).invoke(`rowsPerPageOnChange`)(0)

    expect(wrapper.find(TableContent).prop(`dataRows`)).toHaveLength(bulkExperiments.length)
  })

  test(`can search all fields using the top-right text input`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)

    wrapper.find(TablePreamble).invoke(`searchAllOnChange`)(`foobar`)
    expect(wrapper.find(TableContent).prop(`dataRows`)).toHaveLength(0)

    const randomMatchingValue =
      _.toString(
        getRandomValueFromKeyedRows(
          bulkExperiments, _.sample([ ...bulkTableHeaders, ...bulkDropdownFilters ]).dataKey))
    wrapper.find(TablePreamble).invoke(`searchAllOnChange`)(randomMatchingValue)
    expect(wrapper.find(TableContent).prop(`dataRows`).length).toBeGreaterThan(0)
  })

  test(`can filter using a randomly picked searchable header`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)

    const randomTableHeaderCellFilter = _.sample(bulkTableHeaders.filter(header => header.searchable))
    const randomTableHeaderCellValueSubstring =
      randomSubstring(getRandomValueFromKeyedRows(bulkExperiments, randomTableHeaderCellFilter.dataKey))
    wrapper.find(TableContent).invoke(`tableHeaderCellOnChange`)(randomTableHeaderCellFilter.dataKey, randomTableHeaderCellValueSubstring)

    expect(wrapper).toHaveState({ filters: { [randomTableHeaderCellFilter.dataKey]: randomTableHeaderCellValueSubstring } })

    _.chain(wrapper.find(TableContent).prop(`dataRows`))
      .map(randomTableHeaderCellFilter.dataKey)
      // Fields can be multi-valued (i.e. arrays), so we convert all types to arrays and validate below
      .map(dataRowValue => [].concat(dataRowValue))
      .forEach(
        dataRowValueArray =>
          expect(dataRowValueArray)
            .toEqual(
              expect.arrayContaining(
                [expect.stringMatching(
                  // Some descriptions contain parentheses (!)
                  new RegExp(randomTableHeaderCellValueSubstring.replace(`(`, `\\(`).replace(`)`, `\\)`), `i`))])))
  })

  test(`removes empty strings from filters`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)

    const randomTableHeaderCellFilter = _.sample(bulkTableHeaders.filter(header => header.searchable))
    wrapper.find(TableContent).invoke(`tableHeaderCellOnChange`)(randomTableHeaderCellFilter.dataKey, `    \t \n  `)

    expect(wrapper.state(`filters`)).not.toHaveProperty(randomTableHeaderCellFilter.dataKey)
  })

  test(`can initially set filters through props`, () => {
    const dropdownFilters = _.cloneDeep(bulkDropdownFilters)
    const tableHeaders = _.cloneDeep(bulkTableHeaders)

    const randomFilter = _.sample([ ...dropdownFilters, ...tableHeaders ])
    randomFilter.value = randomString()

    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={tableHeaders}
          dropdownFilters={dropdownFilters}/>)

    expect(wrapper.state(`filters`)).toHaveProperty(randomFilter.dataKey, randomFilter.value)
  })

  test(`can sort using a randomly picked sortable header`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)
    const sortColumnIndex = wrapper.state(`sortColumnIndex`)

    const randomSortableTableHeaderCell = _.sample(bulkTableHeaders.filter(tableHeader => tableHeader.sortable))
    const randomSortableTableHeaderCellIndex =
      bulkTableHeaders.findIndex(tableHeader => tableHeader.dataKey === randomSortableTableHeaderCell.dataKey)
    wrapper.find(TableContent).invoke(`tableHeaderCellOnClick`)(randomSortableTableHeaderCellIndex)

    expect(wrapper).toHaveState({
      sortColumnIndex: randomSortableTableHeaderCellIndex,
      ascendingOrder: sortColumnIndex !== randomSortableTableHeaderCellIndex
    })

    // Remember that dates are formatted as DD-MM-YYYY and we need to treat it in a specific way
    const expected =
      _.chain(wrapper.find(TableContent).prop(`dataRows`))
        .sortBy(randomSortableTableHeaderCell.dataKey.toLowerCase().includes(`date`) ?
          dataRow => dataRow[randomSortableTableHeaderCell.dataKey].split(`-`).reverse().join(``) :  // DD-MM-YYYY -> YYYYMMDD
          randomSortableTableHeaderCell.dataKey)
        .value()

    expect(wrapper.find(TableContent).prop(`dataRows`)).toEqual(expected)
  })

  test(`can sort in descending order`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)
    const sortColumnIndex = wrapper.state(`sortColumnIndex`)

    const randomSortableTableHeaderCell = _.sample(bulkTableHeaders.filter(tableHeader => tableHeader.sortable))
    const randomSortableTableHeaderCellIndex =
      bulkTableHeaders.findIndex(tableHeader => tableHeader.dataKey === randomSortableTableHeaderCell.dataKey)

    wrapper.find(TableContent).invoke(`tableHeaderCellOnClick`)(randomSortableTableHeaderCellIndex)
    // Click twice if it’s a different column other than the default
    if (sortColumnIndex !== randomSortableTableHeaderCellIndex) {
      wrapper.find(TableContent).invoke(`tableHeaderCellOnClick`)(randomSortableTableHeaderCellIndex)
    }

    expect(wrapper).toHaveState({
      ascendingOrder: false
    })

    // Remember that dates are formatted as DD-MM-YYYY and we need to treat it in a specific way
    const expected =
      _.chain(wrapper.find(TableContent).prop(`dataRows`))
        .cloneDeep()  // Because reverse mutates the array
        .sortBy(randomSortableTableHeaderCell.dataKey.toLowerCase().includes(`date`) ?
          dataRow => dataRow[randomSortableTableHeaderCell.dataKey].split(`-`).reverse().join(``) :  // DD-MM-YYYY -> YYYYMMDD
          randomSortableTableHeaderCell.dataKey)
        // Rows with the same value may appear in different order, we must check the sorted column only!
        .map(dataRow => _.pick(dataRow, randomSortableTableHeaderCell.dataKey))
        .reverse()
        .value()

    expect(
      wrapper.find(TableContent).prop(`dataRows`)
        .map(dataRow => _.pick(dataRow, randomSortableTableHeaderCell.dataKey))
    ).toEqual(expected)
  })

  test(`can sort dates in DD-MM-YYYY format`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)

    const randomSortableTableHeaderCell =
      _.sample(
        bulkTableHeaders
          .filter(tableHeader => tableHeader.sortable)
          .filter(tableHeader => tableHeader.dataKey.match(/.*date.*/i))
      )
    const randomSortableTableHeaderCellIndex =
      bulkTableHeaders.findIndex(tableHeader => tableHeader.dataKey === randomSortableTableHeaderCell.dataKey)
    wrapper.find(TableContent).invoke(`tableHeaderCellOnClick`)(randomSortableTableHeaderCellIndex)



    // Remember that dates are formatted as DD-MM-YYYY and we need to treat it in a specific way
    const expected =
      _.chain(wrapper.find(TableContent).prop(`dataRows`))
        .sortBy(dataRow => dataRow[randomSortableTableHeaderCell.dataKey].split(`-`).reverse().join(``))
        .value()

    expect(wrapper.find(TableContent).prop(`dataRows`)).toEqual(expected)
  })

  test(`can select rows with the selection column`, () => {
    const rowSelectionColumn = {
      label: `Download`,
      dataKey: `experimentAccession`,
    }
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}
          rowSelectionColumn={rowSelectionColumn}/>)

    const rowSelectionCount = getRandomInt(1, wrapper.state(`rowsPerPage`))

    for (let i = 0; i < rowSelectionCount; i++) {
      const accession = wrapper.find(TableContent).prop(`dataRows`)[i][rowSelectionColumn.dataKey]
      wrapper.find(TableContent).invoke(`selectOnChange`)(accession)
    }

    expect(wrapper.state(`selectedRows`)).toHaveLength(rowSelectionCount)
  })

  test(`changes the displayed iterms when the page is changed in the footer`, () => {
    const wrapper =
      shallow(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}/>)

    expect(wrapper).toHaveState({ currentPage: 1 })
    const experimentAccessionsInFirstPage = wrapper.find(TableContent).prop(`dataRows`).map(e => e.experimentAccession)

    wrapper.find(TableFooter).invoke(`onChange`)(5)

    expect(wrapper).toHaveState({ currentPage: 5 })
    const rowsInAnotherPage = wrapper.find(TableContent).prop(`dataRows`).map(e => e.experimentAccession)

    expect(_.intersection(experimentAccessionsInFirstPage, rowsInAnotherPage)).toHaveLength(0)
  })

  test(`matches snapshot (bulk)`, () => {
    const wrapper =
      mount(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={bulkTableHeaders}
          dropdownFilters={bulkDropdownFilters}
          rowSelectionColumn={bulkRowSelectionColumn}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (single cell)`, () => {
    const wrapper =
      mount(
        <TableManager
          {...props}
          dataRows={bulkExperiments}
          tableHeaders={singleCellTableHeaders}
          dropdownFilters={singleCellDropdownFilters}
          rowSelectionColumn={singleCellRowSelectionColumn}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
