import React from 'react'
import { mount } from 'enzyme'
import { Route, MemoryRouter } from 'react-router-dom'

import '@babel/polyfill'
import TableManagerRoute from '../src/TableManagerRoute'
import TableManager from '../src/TableManager'

import randomString from 'random-string'
import {
  getRandomInt,
  singleCellTableHeaders, singleCellDropdownFilters, downloadFileTypes } from './TestUtils'
import singleCellExperiments from './experiments-sc.json'

describe(`TableManagerRoute`, () => {
  test(`renders a TableManager component at /experiments`, () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ `/experiments` ]}>
        <TableManagerRoute
          downloadFileTypes={downloadFileTypes}
          tableHeaders={singleCellTableHeaders}
          dropdownFilters={singleCellDropdownFilters}
          dataRows={singleCellExperiments} />
      </MemoryRouter>
    )

    expect(wrapper).toContainExactlyOneMatchingElement(TableManager)
  })

  test(`renders nothing at any other route`, () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ `/${randomString()}` ]}>
        <TableManagerRoute
          downloadFileTypes={downloadFileTypes}
          tableHeaders={singleCellTableHeaders}
          dropdownFilters={singleCellDropdownFilters}
          dataRows={singleCellExperiments} />
      </MemoryRouter>
    )

    expect(wrapper).toBeEmptyRender()
  })

  test(`updates URL when afterStatusUpdate is called`, () => {
    let testHistory
    let testLocation

    const wrapper = mount(
      <MemoryRouter initialEntries={[ `/experiments` ]}>
        <TableManagerRoute
          downloadFileTypes={downloadFileTypes}
          tableHeaders={singleCellTableHeaders}
          dropdownFilters={singleCellDropdownFilters}
          dataRows={singleCellExperiments} />
        <Route
          path={`*`}
          render={routeProps => {
            testHistory = routeProps.history
            testLocation = routeProps.location
            return null
          }}/>
      </MemoryRouter>
    )

    wrapper.find(TableManager).invoke(`afterStateUpdate`)({foo: `bar`})
    const searchParams = new URLSearchParams(testLocation.search)
    expect(searchParams.get(`foo`)).toEqual(`bar`)

    expect(testHistory).toHaveLength(2)
    expect(testHistory.entries[0]).toHaveProperty(`search`, ``)
  })

  test(`sets initial filter values from URL`, () => {
    const randomTableHeaderIndex = getRandomInt(0, singleCellTableHeaders.length)
    const randomDropdownFilterIndex = getRandomInt(0, singleCellDropdownFilters.length)

    const wrapper = mount(
      <MemoryRouter
        initialEntries={[
          `/experiments?` +
          `${singleCellTableHeaders[randomTableHeaderIndex].dataKey}=foo&` +
          `${singleCellDropdownFilters[randomDropdownFilterIndex].dataKey}=bar`
        ]}>
        <TableManagerRoute
          downloadFileTypes={downloadFileTypes}
          tableHeaders={singleCellTableHeaders}
          dropdownFilters={singleCellDropdownFilters}
          dataRows={singleCellExperiments} />
      </MemoryRouter>
    )

    const tableHeadersProp = wrapper.find(TableManager).prop(`tableHeaders`)
    expect(tableHeadersProp)
      .toContainEqual({ ...singleCellTableHeaders[randomTableHeaderIndex], value: `foo`})

    const dropdownFiltersProp = wrapper.find(TableManager).prop(`dropdownFilters`)
    expect(dropdownFiltersProp)
      .toContainEqual({ ...singleCellDropdownFilters[randomDropdownFilterIndex], value: `bar`})
  })

  test(`ignores non-matching filter values from URL`, () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[ `/experiments?foo=bar` ]}>
        <TableManagerRoute
          downloadFileTypes={downloadFileTypes}
          tableHeaders={singleCellTableHeaders}
          dropdownFilters={singleCellDropdownFilters}
          dataRows={singleCellExperiments} />
      </MemoryRouter>
    )

    const tableHeadersProp = wrapper.find(TableManager).prop(`tableHeaders`)
    expect(tableHeadersProp).toEqual(singleCellTableHeaders)

    const dropdownFiltersProp = wrapper.find(TableManager).prop(`dropdownFilters`)
    expect(dropdownFiltersProp).toEqual(singleCellDropdownFilters)
  })
})
